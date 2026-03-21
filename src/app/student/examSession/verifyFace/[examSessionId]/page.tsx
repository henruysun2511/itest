"use client";

import { useExamSessionJoin } from "@/queries/useExamSessionQuery";
import { useExamSSE } from "@/hooks/useExamSSE";
import { useExamStore } from "@/stores/useExamStore";
import { Button, Card, message, Spin, Typography } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const { Title, Text } = Typography;

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
    const lastStepTimeRef = useRef(0);
    const lastErrorTimeRef = useRef(0);
    const faceMeshRef = useRef<any>(null); // Lưu FaceMesh vào ref để cleanup
    const brightnessCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isTooDark, setIsTooDark] = useState(false); // State để hiển thị UI cảnh báo

    const { mutate: joinExam, isPending } = useExamSessionJoin();
    const { latestEvent } = useExamSSE(examSessionId);

    // Xử lý chặn nếu Giám thị Tạm dừng hoặc Kết thúc ca thi lúc đang soi mặt
    useEffect(() => {
        if (!latestEvent) return;
        if (latestEvent.type === 'SESSION_STATUS_CHANGED') {
            if (latestEvent.data?.status === 'PAUSE') {
                message.warning('Ca thi đang bị tạm dừng bởi Giám thị, bạn chưa thể vào thi ngay lúc này!');
            } else if (latestEvent.data?.status === 'FINISHED') {
                message.error('Ca thi đã kết thúc!');
                router.push('/student');
            }
        }
    }, [latestEvent, router]);

    const instructions = [
        "Vui lòng xoay mặt sang TRÁI",
        "Vui lòng xoay mặt sang PHẢI",
        "Nhìn THẲNG vào camera để chụp ảnh",
    ];

    const getBrightness = (video: HTMLVideoElement) => {
        if (!brightnessCanvasRef.current) {
            brightnessCanvasRef.current = document.createElement('canvas');
        }
        const canvas = brightnessCanvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true }); // Tối ưu cho getImageData
        if (!ctx) return 255;

        canvas.width = 40;
        canvas.height = 30;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        let colorSum = 0;
        for (let i = 0; i < data.length; i += 4) {
            colorSum += (data[i] + data[i + 1] + data[i + 2]) / 3;
        }
        return colorSum / (canvas.width * canvas.height);
    };

    useEffect(() => {
        let active = true; // Flag để tránh update state khi component đã unmount

        const loadFaceMesh = () => {
            return new Promise<void>((resolve, reject) => {
                if (window.FaceMesh) { resolve(); return; }
                const script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js";
                script.crossOrigin = "anonymous";
                script.onload = () => resolve();
                script.onerror = () => reject(new Error("Failed to load FaceMesh"));
                document.head.appendChild(script);
            });
        };

        const startDetection = async () => {
            try {
                await loadFaceMesh();
                if (!active) return;

                const faceMesh = new window.FaceMesh({
                    locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
                });
                faceMeshRef.current = faceMesh;

                faceMesh.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.6,
                    minTrackingConfidence: 0.6,
                });

                faceMesh.onResults((results: any) => {

                    const now = Date.now();

                    if (now - lastErrorTimeRef.current > 1000 && videoRef.current) {
                        const brightness = getBrightness(videoRef.current);
                        const tooDark = brightness < 40;
                        setIsTooDark(tooDark);
                        if (tooDark) {
                            message.warning("Ánh sáng yếu, vui lòng bật thêm đèn để đảm bảo xác thực!", 1);
                        }
                        lastErrorTimeRef.current = now;
                    }

                    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;

                    const landmarks = results.multiFaceLandmarks[0];
                    const leftEye = landmarks[33];
                    const rightEye = landmarks[263];
                    const nose = landmarks[1];

                    // Tọa độ X trong Mediapipe: 0 (trái) -> 1 (phải)
                    // Khi soi gương (mirror), hướng bị đảo ngược
                    const diff = nose.x - (leftEye.x + rightEye.x) / 2;

                    if (now - lastStepTimeRef.current < 800) return;

                    // ✅ SỬA LOGIC: Đảo ngược diff để khớp với camera mirror
                    // Step 0: Xoay TRÁI người dùng -> Mũi lệch về bên phải camera (diff dương)
                    if (step === 0 && diff > 0.05) {
                        lastStepTimeRef.current = now;
                        setStep(1);
                        message.success("Đã nhận diện xoay trái ✓");
                    }
                    // Step 1: Xoay PHẢI người dùng -> Mũi lệch về bên trái camera (diff âm)
                    else if (step === 1 && diff < -0.05) {
                        lastStepTimeRef.current = now;
                        setStep(2);
                        message.success("Đã nhận diện xoay phải ✓");
                    }
                    // Step 2: Nhìn THẲNG
                    else if (step === 2 && Math.abs(diff) < 0.02) {
                        capturePhoto();
                    }
                });

                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current && active) {
                    videoRef.current.srcObject = stream;
                    setLoadingCamera(false);

                    const detect = async () => {
                        if (videoRef.current && faceMeshRef.current && active) {
                            await faceMeshRef.current.send({ image: videoRef.current });
                            requestAnimationFrame(detect);
                        }
                    };
                    detect();
                }
            } catch (err) {
                console.error(err);
                message.error("Lỗi khởi tạo camera");
            }
        };

        startDetection();

        return () => {
            active = false;
            // ✅ TẮT CAMERA TUYỆT ĐỐI
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => {
                    track.stop();
                    console.log("Track stopped:", track.kind);
                });
                videoRef.current.srcObject = null;
            }
            // Giải phóng FaceMesh
            if (faceMeshRef.current) {
                faceMeshRef.current.close();
            }
        };
    }, [step]); // Dependency step để cập nhật logic check trong onResults

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current || hasCapturedRef.current) return;
        hasCapturedRef.current = true;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // Lưu ý: Nếu muốn ảnh lưu trữ KHÔNG bị ngược, ta lật ngược lại lúc vẽ vào canvas
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0);

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], "face_verification.jpg", { type: "image/jpeg" });
                setCapturedFile(file);
                message.success("Xác thực khuôn mặt thành công");
            }
        }, "image/jpeg");
    };

    const setExamData = useExamStore((state) => state.setExamData);
    const handleJoinExam = () => {
        if (!capturedFile) return message.error("Chưa có ảnh xác thực");
        joinExam({ id: examSessionId, file: capturedFile }, {
            onSuccess: (res) => {
                message.success("Tham gia ca thi thành công");
                const rawData = res?.data?.data;

                if (!rawData) {
                    console.error("API Response Data is missing:", res);
                    message.error("Không thể lấy thông tin bài thi. Vui lòng thử lại!");
                    return;
                }

                const {
                    randomExamId: examId,
                    examAttemptId,
                    examSessionId: resSessionId
                } = rawData;

                if (!examId || !examAttemptId) {
                    console.error("Missing IDs:", { examId, examAttemptId });
                    message.warning("Dữ liệu bài thi chưa sẵn sàng.");
                    return;
                }

                message.success("Tham gia ca thi thành công!");

                setExamData(rawData);

                const targetSessionId = resSessionId || examSessionId;
                const url = `/student/examSession/takeExam/${targetSessionId}?examId=${examId}&examAttemptId=${examAttemptId}`;

                console.log("Redirecting to:", url);
                router.push(url);
            },
            onError: (error: any) => message.error(error?.response?.data?.message || "Lỗi tham gia ca thi")
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-main)] p-4 md:p-8 font-inter">
            <Card className="w-full max-w-[800px] shadow-2xl border-none rounded-[40px] overflow-hidden bg-white" bodyStyle={{ padding: '48px' }}>
                <div className="text-center mb-10">
                    <Title level={2} className="!text-[var(--color-navy-deep)] !mb-3 tracking-tight">Xác minh danh tính</Title>
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-50 rounded-2xl border border-amber-100">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                        <Text className="text-amber-800 font-semibold text-base">{instructions[step]}</Text>
                    </div>
                </div>

                <div className="relative mx-auto w-full aspect-[4/3] max-w-[680px] bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border-[6px] border-white ring-2 ring-slate-100">
                    {isTooDark && (
                        <div className="absolute inset-0 z-30 bg-black/60 flex items-center justify-center text-center p-4 transition-opacity">
                            <div className="bg-white p-4 rounded-2xl shadow-xl">
                                <Text strong className="text-red-500 block">⚠️ KHÔNG ĐỦ ÁNH SÁNG</Text>
                                <Text>Vui lòng di chuyển đến nơi sáng hơn</Text>
                            </div>
                        </div>
                    )}
                    {loadingCamera && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950 text-white">
                            <Spin size="large" />
                            <p className="mt-6 text-lg font-medium text-slate-400">Đang thiết lập kết nối...</p>
                        </div>
                    )}
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />

                    {!capturedFile && !loadingCamera && !isTooDark && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="w-[70%] h-[80%] border-2 border-dashed border-white/40 rounded-[120px] relative">
                                <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-[var(--color-accent)] rounded-tl-3xl"></div>
                                <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-[var(--color-accent)] rounded-tr-3xl"></div>
                                <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-[var(--color-accent)] rounded-bl-3xl"></div>
                                <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-[var(--color-accent)] rounded-br-3xl"></div>
                                <div className="w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent absolute top-1/2 animate-scan shadow-[0_0_15px_var(--color-accent)]"></div>
                            </div>
                        </div>
                    )}
                </div>

                <canvas ref={canvasRef} className="hidden" />

                {capturedFile && (
                    <div className="mt-10 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-center gap-8 p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                            <img src={URL.createObjectURL(capturedFile)} className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-md" alt="Face" />
                            <div className="flex-1">
                                <Title level={4} className="!m-0 text-[var(--color-navy-main)]">Ảnh đã sẵn sàng!</Title>
                                <Text className="text-slate-500">Hệ thống đã ghi nhận dữ liệu khuôn mặt của bạn.</Text>
                            </div>
                        </div>
                        <Button type="primary" block size="large" className="mt-8 h-16 rounded-2xl text-xl font-bold bg-[var(--color-navy-main)]" loading={isPending} onClick={handleJoinExam}>
                            XÁC NHẬN & VÀO THI
                        </Button>
                    </div>
                )}

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
                    @keyframes scan { 0% { top: 5%; opacity: 0; } 50% { opacity: 1; } 100% { top: 95%; opacity: 0; } }
                    .animate-scan { position: absolute; animation: scan 3s ease-in-out infinite; }
                `}</style>
            </Card>
        </div>
    );
}