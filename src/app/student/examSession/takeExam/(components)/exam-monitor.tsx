"use client";

import { FraudType } from '@/shares/constants/type.enum';
import { message } from 'antd';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    FaceMesh: any;
    Camera: new (videoElement: HTMLVideoElement, options: {
      onFrame: () => Promise<void>;
      width: number;
      height: number;
    }) => {
      start: () => Promise<void>;
      stop: () => void;
    };
  }
}

interface Props {
  examAttemptId: string;
  onViolation: (type: FraudType, faceData?: string) => void;
}

export default function ExamMonitor({ examAttemptId, onViolation }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceMeshRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  // Refs để quản lý trạng thái vi phạm và thời gian
  const violationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentViolationTypeRef = useRef<FraudType | null>(null);

  useEffect(() => {
    let active = true;

    const loadScripts = async () => {
      await Promise.all([
        loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"),
        loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js")
      ]);
      if (active) initFaceMesh();
    };

    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
        const script = document.createElement("script");
        script.src = src;
        script.crossOrigin = "anonymous";
        script.onload = () => resolve(true);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initFaceMesh = () => {
      const faceMesh = new window.FaceMesh({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 2, // Cho phép nhận diện đến 2 mặt để check MULTIPLE_FACES
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults(onResults);
      faceMeshRef.current = faceMesh;

      if (videoRef.current) {
        cameraRef.current = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (faceMeshRef.current) {
              await faceMeshRef.current.send({ image: videoRef.current! });
            }
          },
          width: 640,
          height: 480,
        });
        cameraRef.current.start();
      }
    };

    const onResults = (results: any) => {
      const detectedFaces = results.multiFaceLandmarks || [];
      let violationFound: FraudType | null = null;

      // TRƯỜNG HỢP 1: KHÔNG CÓ MẶT
      if (detectedFaces.length === 0) {
        violationFound = FraudType.NO_FACE_DETECTED;
      }
      // TRƯỜNG HỢP 2: NHIỀU MẶT (Phát hiện từ 2 mặt trở lên)
      else if (detectedFaces.length > 1) {
        violationFound = FraudType.MULTIPLE_FACES_DETECTED;
      }
      // TRƯỜNG HỢP 3: CÓ 1 MẶT NHƯNG QUAY TRÁI/PHẢI/CÚI
      else {
        const landmarks = detectedFaces[0];
        const nose = landmarks[1];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const chin = landmarks[152];
        const forehead = landmarks[10];

        const eyeCenter_x = (leftEye.x + rightEye.x) / 2;
        const yaw_diff = nose.x - eyeCenter_x; // Quay mặt
        const faceCenter_y = (forehead.y + chin.y) / 2;
        const pitch_diff = nose.y - faceCenter_y; // Cúi/Ngước

        // Nếu quay quá xa hoặc cúi quá thấp, tính là NO_FACE_DETECTED (mất dấu diện mạo thẳng)
        if (Math.abs(yaw_diff) > 0.07 || pitch_diff > 0.06) {
          violationFound = FraudType.NO_FACE_DETECTED;
        }
      }

      // LOGIC XỬ LÝ TIMER 1 GIÂY
      if (violationFound) {
        // Nếu vi phạm mới khác vi phạm đang đếm, hoặc chưa có vi phạm nào
        if (currentViolationTypeRef.current !== violationFound) {
          clearViolationTimer();
          currentViolationTypeRef.current = violationFound;

          violationTimerRef.current = setTimeout(() => {
            const evidence = captureEvidence();
            onViolation(violationFound!, evidence);

            // Thông báo thân thiện cho sinh viên
            const msg = violationFound === FraudType.MULTIPLE_FACES_DETECTED
              ? "Phát hiện nhiều người trong khung hình!"
              : "Vui lòng nhìn thẳng vào camera!";
            message.warning(msg);

            clearViolationTimer();
          }, 1000); // Ngưỡng 1 giây
        }
      } else {
        // Nếu tư thế đã đúng, xóa đếm ngược
        clearViolationTimer();
      }
    };

    const clearViolationTimer = () => {
      if (violationTimerRef.current) {
        clearTimeout(violationTimerRef.current);
        violationTimerRef.current = null;
      }
      currentViolationTypeRef.current = null;
    };

    const captureEvidence = (): string => {
      if (!videoRef.current || !canvasRef.current) return '';
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.6);
      }
      return '';
    };

    loadScripts();

    return () => {
      active = false;
      if (cameraRef.current) cameraRef.current.stop(); 
      if (faceMeshRef.current) faceMeshRef.current.close();

      // Tắt luồng video trực tiếp từ trình duyệt
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      clearViolationTimer();
    };
  }, [onViolation]);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 w-48 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        {currentViolationTypeRef.current && (
          <div className="absolute inset-0 bg-red-600/20 border-2 border-red-500 animate-pulse flex items-end justify-center pb-2">
            <span className="text-[10px] text-white font-bold bg-red-600 px-2 py-0.5 rounded">
              VI PHẠM: {currentViolationTypeRef.current === FraudType.MULTIPLE_FACES_DETECTED ? 'NHIỀU MẶT' : 'NHÌN THẲNG'}
            </span>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}