import { useEffect, useState } from 'react';

export function useExamTimer(examSessionId: string, duration?: number, consumedTime: number = 0, lastResumedAt?: string | null) {
    const [endTime, setEndTime] = useState<number>(() => {
        if (typeof window === 'undefined') return Date.now();
        const saved = localStorage.getItem(`exam_endtime_${examSessionId}`);
        return saved ? parseInt(saved, 10) : Date.now();
    });

    useEffect(() => {
        if (!duration) return;

        const storageKey = `exam_endtime_${examSessionId}`;
        const saved = localStorage.getItem(storageKey);

        let calculatedEndTime = Date.now();
        
        // Nếu có mốc thời gian tiếp tục / bắt đầu từ backend, ưu tiên dùng mốc đó
        if (lastResumedAt) {
            const lastResumedTimeMs = new Date(lastResumedAt).getTime();
            const remainingMs = (duration * 60 * 1000) - (consumedTime * 1000);
            calculatedEndTime = lastResumedTimeMs + remainingMs;
        } else {
            // Fallback (chẳng hạn nếu chưa có lastResumedAt thì tính theo local của trình duyệt)
            const remainingSeconds = (duration * 60) - consumedTime;
            calculatedEndTime = Date.now() + remainingSeconds * 1000;
        }

        if (saved) {
            const savedTime = parseInt(saved, 10);
            const diff = Math.abs(savedTime - calculatedEndTime);
            
            // Nếu chênh lệch > 5s (do server trả về consumedTime mới/lastResumedAt mới)
            if (diff > 5000 && lastResumedAt) {
                 localStorage.setItem(storageKey, calculatedEndTime.toString());
                 setEndTime(calculatedEndTime);
            } else {
                 setEndTime(savedTime);
            }
        } else {
            localStorage.setItem(storageKey, calculatedEndTime.toString());
            setEndTime(calculatedEndTime);
        }
    }, [examSessionId, duration, consumedTime, lastResumedAt]);

    return endTime;
}
