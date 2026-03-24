import { useHeartbeat, useReportFraud, useVerifyFaceAttempt } from '@/queries/useExamAttemptQuery';
import { FraudType } from '@/shares/constants/type.enum';
import { message } from 'antd';
import { useCallback, useEffect } from 'react';

export function useExamSecurity(
    examAttemptId: string | null,
    isCameraRequired: boolean | undefined
) {
    const { mutate: sendHeartbeat } = useHeartbeat();
    const { mutate: reportFraud } = useReportFraud();
    const { mutate: verifyFace } = useVerifyFaceAttempt();

    // 1. Heartbeat - Giữ kết nối (Chạy mỗi 10s để duy trì Presence 15s trong Redis)
    useEffect(() => {
        if (!examAttemptId) return;

        // Gửi heartbeat ngay lập tức
        sendHeartbeat(examAttemptId);

        // Gửi định kỳ mỗi 10 giây
        const interval = setInterval(() => {
            sendHeartbeat(examAttemptId);
        }, 10000);

        const handleOffline = () => sendHeartbeat(examAttemptId);
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') sendHeartbeat(examAttemptId);
        };
        const handleBeforeUnload = () => sendHeartbeat(examAttemptId);

        window.addEventListener('offline', handleOffline);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener('offline', handleOffline);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [examAttemptId, sendHeartbeat]);

    // 2. Phát hiện gian lận trình duyệt
    useEffect(() => {
        if (!examAttemptId) return;

        const sendFraudReport = (type: FraudType, warningMsg: string) => {
            reportFraud({ examAttemptId, data: { fraudType: type } });
            if (warningMsg) message.warning(warningMsg);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                sendFraudReport(FraudType.TAB_SWITCHING, "Cảnh báo: Bạn vừa rời khỏi trang thi!");
            }
        };

        const handleWindowBlur = () => {
            sendFraudReport(FraudType.WINDOW_BLUR, "Cảnh báo: Không được rời khỏi cửa sổ làm bài!");
        };

        const handleOffline = () => {
            sendFraudReport(FraudType.NETWORK_DISRUPTION, "Cảnh báo: Kết nối mạng bị gián đoạn!");
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('offline', handleOffline);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('offline', handleOffline);
        };
    }, [examAttemptId, reportFraud]);

    // 3. Tự động chụp ảnh khuôn mặt
    useEffect(() => {
        if (!examAttemptId || !isCameraRequired) return;

        const VERIFY_INTERVAL = 3 * 60 * 1000; // 3 phút
        const handleAutoCapture = () => {
            const video = document.querySelector('video');
            if (!video || video.readyState !== 4) return;

            const canvas = document.createElement('canvas');
            canvas.width = 320;
            canvas.height = 240;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                if (blob) {
                    const faceFile = new File([blob], `verify_${examAttemptId}_${Date.now()}.jpg`, { type: "image/jpeg" });
                    verifyFace({ examAttemptId, face: faceFile, occurredAt: new Date() }, {
                        onError: () => message.warning("Hệ thống giám sát không nhận diện được khuôn mặt, vui lòng chỉnh lại vị trí ngồi!")
                    });
                }
            }, "image/jpeg", 0.7);
        };

        const firstShot = setTimeout(handleAutoCapture, 60000);
        const interval = setInterval(handleAutoCapture, VERIFY_INTERVAL);

        return () => {
            clearTimeout(firstShot);
            clearInterval(interval);
        };
    }, [examAttemptId, isCameraRequired, verifyFace]);

    // 4. Exposed function cho ExamMonitor component
    const handleViolationDetected = useCallback((type: FraudType) => {
        if (!examAttemptId) return;
        reportFraud({ examAttemptId, data: { fraudType: type } });
    }, [examAttemptId, reportFraud]);

    return { handleViolationDetected };
}
