import { useMemo } from 'react';

export function useExamTimer(examSessionId: string, duration?: number) {
    const endTime = useMemo(() => {
        const storageKey = `exam_endtime_${examSessionId}`;
        const saved = localStorage.getItem(storageKey);

        if (saved) {
            return parseInt(saved, 10);
        }

        if (duration) {
            const time = Date.now() + duration * 60 * 1000;
            localStorage.setItem(storageKey, time.toString());
            return time;
        }

        return Date.now();
    }, [examSessionId, duration]);

    return endTime;
}
