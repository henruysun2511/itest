"use client";

import { useExamSessionJoin } from "@/queries/useExamSessionQuery";
import { Button, Card, message, Spin, Typography } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const { Title, Text } = Typography;

// ✅ FIX: Déclarer FaceMesh via le type global chargé depuis le CDN
declare global {
    interface Window {
        FaceMesh: any;
    }
}

export default function VerifyFacePage() {
    const params = useParams();
    const examSessionId = params.examSessionId as string;

    const router = useRouter();

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [step, setStep] = useState(0);
    const [capturedFile, setCapturedFile] = useState<File | null>(null);
    const [loadingCamera, setLoadingCamera] = useState(true);
    const hasCapturedRef = useRef(false);
    const lastStepTimeRef = useRef(0);    // ✅ chống nhạy: bắt buộc giữ pose 500ms
    const lastErrorTimeRef = useRef(0);   // ✅ chống spam message lỗi (1 lần/2s)

    const { mutate: joinExam, isPending } = useExamSessionJoin();

    const instructions = [
        "Vui lòng xoay mặt sang TRÁI",
        "Vui lòng xoay mặt sang PHẢI",
        "Nhìn THẲNG vào camera để chụp ảnh",
    ];

    /* ================= FACE DETECTION ================= */

    useEffect(() => {
        if (!videoRef.current) return;

        // ✅ FIX: Charger @mediapipe/face_mesh depuis le CDN via un script dynamique
        //         au lieu d'un import statique qui casse Turbopack
        const loadFaceMesh = () => {
            return new Promise<void>((resolve, reject) => {
                if (window.FaceMesh) {
                    resolve();
                    return;
                }

                const script = document.createElement("script");
                script.src =
                    "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js";
                script.crossOrigin = "anonymous";
                script.onload = () => resolve();
                script.onerror = () => reject(new Error("Failed to load FaceMesh"));
                document.head.appendChild(script);
            });
        };

        const startDetection = async () => {
            try {
                await loadFaceMesh();

                const faceMesh = new window.FaceMesh({
                    locateFile: (file: string) =>
                        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
                });

                faceMesh.setOptions({
                    maxNumFaces: 2,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.6,
                    minTrackingConfidence: 0.6,
                });

                faceMesh.onResults((results: any) => {
                    if (!results.multiFaceLandmarks) return;

                    const faces = results.multiFaceLandmarks;
                    const now = Date.now();

                    if (faces.length === 0) return;

                    /* ===== NHIỀU KHUÔN MẶT: chỉ báo lỗi mỗi 2 giây ===== */
                    if (faces.length > 1) {
                        if (now - lastErrorTimeRef.current > 2000) {
                            lastErrorTimeRef.current = now;
                            message.error("Phát hiện nhiều khuôn mặt. Vui lòng chỉ để 1 người.");
                        }
                        return;
                    }

                    const landmarks = faces[0];
                    const leftEye = landmarks[33];
                    const rightEye = landmarks[263];
                    const nose = landmarks[1];
                    const diff = nose.x - (leftEye.x + rightEye.x) / 2;

                    // Cooldown 500ms giữa mỗi bước để tránh trigger liên tục
                    if (now - lastStepTimeRef.current < 500) return;

                    /* ===== BƯỚC 1: XOAY TRÁI (ngưỡng -0.05 chặt hơn) ===== */
                    if (step === 0 && diff < -0.05) {
                        lastStepTimeRef.current = now;
                        setStep(1);
                        message.success("Đã nhận diện xoay trái ✓");
                        return;
                    }

                    /* ===== BƯỚC 2: XOAY PHẢI (ngưỡng +0.05 chặt hơn) ===== */
                    if (step === 1 && diff > 0.05) {
                        lastStepTimeRef.current = now;
                        setStep(2);
                        message.success("Đã nhận diện xoay phải ✓");
                        return;
                    }

                    /* ===== BƯỚC 3: NHÌN THẲNG ===== */
                    if (step === 2 && Math.abs(diff) < 0.02) {
                        capturePhoto();
                    }
                });

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });

                if (!videoRef.current) return;

                videoRef.current.srcObject = stream;
                setLoadingCamera(false);

                const detect = async () => {
                    if (!videoRef.current) return;
                    await faceMesh.send({ image: videoRef.current });
                    requestAnimationFrame(detect);
                };

                detect();
            } catch {
                message.error("Không thể truy cập camera hoặc tải FaceMesh");
            }
        };

        startDetection();

        return () => {
            // ✅ Utiliser une variable locale pour éviter le warning "ref in cleanup"
            const video = videoRef.current;
            const stream = video?.srcObject as MediaStream;
            stream?.getTracks().forEach((track) => track.stop());
        };
    }, [step]);

    /* ================= CAPTURE PHOTO ================= */

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        if (hasCapturedRef.current) return;
        hasCapturedRef.current = true;      

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.drawImage(videoRef.current, 0, 0);

        canvas.toBlob((blob) => {
            if (!blob) return;

            const file = new File([blob], "face.jpg", { type: "image/jpeg" });

            setCapturedFile(file);
            message.success("Xác thực khuôn mặt thành công");
        }, "image/jpeg");
    };

    /* ================= JOIN EXAM ================= */

    const handleJoinExam = () => {
        if (!capturedFile) {
            message.error("Chưa có ảnh xác thực");
            return;
        }
        console.log(capturedFile)

        joinExam(
            {
                id: examSessionId,
                file: capturedFile,
            },
            {
                onSuccess: (res) => {
                    message.success(res.data?.message || "Tham gia ca thi thành công");
                    router.push(`/examSession/${examSessionId}`);
                },

                onError: (error: any) => {
                    const msg =
                        error?.response?.data?.message || "Không thể tham gia ca thi";

                    message.error(msg);
                },
            }
        );
    };

    /* ================= UI ================= */

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-main)] p-4 md:p-8 font-inter">
            <Card
                className="w-full max-w-[800px] shadow-2xl border-none rounded-[40px] overflow-hidden bg-white"
                bodyStyle={{ padding: '48px' }}
            >
                {/* Header - Tinh gọn để nhường chỗ cho Cam */}
                <div className="text-center mb-10">
                    <Title level={2} className="!text-[var(--color-navy-deep)] !mb-3 tracking-tight">
                        Xác minh danh tính
                    </Title>
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-50 rounded-2xl border border-amber-100">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                        <Text className="text-amber-800 font-semibold text-base">
                            {instructions[step]}
                        </Text>
                    </div>
                </div>

                {/* Camera Area - Phóng to tối đa */}
                <div className="relative group mx-auto w-full aspect-[4/3] max-w-[680px] bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border-[6px] border-white ring-2 ring-slate-100">
                    {loadingCamera && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950 text-white">
                            <Spin size="large" />
                            <p className="mt-6 text-lg font-medium text-slate-400">Đang thiết lập kết nối bảo mật...</p>
                        </div>
                    )}

                    {/* Video stream - scaleX(-1) cho hiệu ứng gương */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                        style={{ transform: 'scaleX(-1)' }}
                    />

                    {/* Overlay khung quét mặt - To và rõ hơn */}
                    {!capturedFile && !loadingCamera && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            {/* Bo góc khung quét theo khuôn mặt */}
                            <div className="w-[70%] h-[80%] border-2 border-dashed border-white/40 rounded-[120px] relative">
                                {/* Góc vuông trang trí */}
                                <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-[var(--color-accent)] rounded-tl-3xl"></div>
                                <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-[var(--color-accent)] rounded-tr-3xl"></div>
                                <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-[var(--color-accent)] rounded-bl-3xl"></div>
                                <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-[var(--color-accent)] rounded-br-3xl"></div>

                                {/* Tia quét ngang */}
                                <div className="w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent absolute top-1/2 animate-scan shadow-[0_0_15px_var(--color-accent)]"></div>
                            </div>
                        </div>
                    )}

                    {/* Cảnh báo ánh sáng/vị trí nhỏ ở góc cam */}
                    {!capturedFile && !loadingCamera && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full">
                            <Text className="text-white text-xs font-light">Đảm bảo khuôn mặt nằm trong khung nét</Text>
                        </div>
                    )}
                </div>

                <canvas ref={canvasRef} className="hidden" />

                {/* Captured Result Overlay - Khi đã chụp xong */}
                {capturedFile && (
                    <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-center gap-8 p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                            <div className="relative">
                                <img
                                    src={URL.createObjectURL(capturedFile)}
                                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-md"
                                    alt="Face capture"
                                />
                                <div className="absolute -right-2 -top-2 bg-[var(--color-success)] text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            </div>
                            <div className="flex-1">
                                <Title level={4} className="!m-0 text-[var(--color-navy-main)]">Ảnh đã sẵn sàng!</Title>
                                <Text className="text-slate-500">Hệ thống đã ghi nhận dữ liệu khuôn mặt của bạn.</Text>
                            </div>
                        </div>

                        <Button
                            type="primary"
                            block
                            size="large"
                            className="mt-8 h-16 rounded-2xl text-xl font-bold bg-[var(--color-navy-main)] hover:bg-[var(--color-navy-light)] border-none shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
                            loading={isPending}
                            onClick={handleJoinExam}
                        >
                            XÁC NHẬN & VÀO THI
                        </Button>
                    </div>
                )}

                {/* Progress Dots */}
                {!capturedFile && !loadingCamera && (
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <div className="flex gap-3">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className={`w-12 h-2 rounded-full transition-all duration-500 ${step >= i ? 'bg-[var(--color-accent)] w-16' : 'bg-slate-200'}`}></div>
                            ))}
                        </div>
                        <Text className="text-slate-400 text-xs font-medium uppercase tracking-widest">Bước {step + 1} / 3</Text>
                    </div>
                )}

                <style jsx global>{`
        @keyframes scan {
          0% { top: 5%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
        .animate-scan {
          position: absolute;
          animation: scan 3s ease-in-out infinite;
        }
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
            </Card>
        </div>
    );
}