import { useMemo, useEffect, useState } from 'react';

export function useExamTimer(examSessionId: string, duration?: number, consumedTime: number = 0) {
    const [endTime, setEndTime] = useState<number>(() => {
        if (typeof window === 'undefined') return Date.now();
        const saved = localStorage.getItem(`exam_endtime_${examSessionId}`);
        return saved ? parseInt(saved, 10) : Date.now();
    });

    useEffect(() => {
        if (!duration) return;

        const storageKey = `exam_endtime_${examSessionId}`;
        const saved = localStorage.getItem(storageKey);

        const remainingSeconds = (duration * 60) - consumedTime;
        const calculatedEndTime = Date.now() + remainingSeconds * 1000;

        if (saved) {
            const savedTime = parseInt(saved, 10);
            const diff = Math.abs(savedTime - calculatedEndTime);
            
            // Nếu chênh lệch > 30s (do Pause hoặc Resume khác máy) và server đã có consumedTime
            if (diff > 30000 && consumedTime >= 0) {
                 localStorage.setItem(storageKey, calculatedEndTime.toString());
                 setEndTime(calculatedEndTime);
            } else {
                 setEndTime(savedTime);
            }
        } else {
            localStorage.setItem(storageKey, calculatedEndTime.toString());
            setEndTime(calculatedEndTime);
        }
    }, [examSessionId, duration, consumedTime]);

    return endTime;
}
