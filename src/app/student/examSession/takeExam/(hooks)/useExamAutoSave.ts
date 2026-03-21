import { useSaveDraft } from '@/queries/useExamAttemptQuery';
import { useEffect, useRef } from 'react';

export function useExamAutoSave(
    examSessionId: string,
    examAttemptId: string | null,
    userAnswers: any[]
) {
    const { mutate: saveDraft } = useSaveDraft();

    const lastSavedAnswersRef = useRef<string>("");
    const currentUserAnswersRef = useRef(userAnswers);

    // Cập nhật ref mỗi khi userAnswers thay đổi
    useEffect(() => {
        currentUserAnswersRef.current = userAnswers;
    }, [userAnswers]);

    useEffect(() => {
        if (!examAttemptId) return;

        const timer = setInterval(() => {
            const currentAnswers = currentUserAnswersRef.current;
            const answersString = JSON.stringify(currentAnswers);

            // CHỈ gọi API nếu: 
            // - Có câu trả lời (length > 0)
            // - VÀ dữ liệu khác với lần đã lưu gần nhất
            if (currentAnswers.length > 0 && answersString !== lastSavedAnswersRef.current) {
                saveDraft({
                    examSessionId: examSessionId,
                    changes: currentAnswers
                }, {
                    onSuccess: () => {
                        // Cập nhật mốc dữ liệu đã lưu thành công
                        lastSavedAnswersRef.current = answersString;
                    }
                });
            }
        }, 10000); // Luôn chạy mỗi 10s cố định

        return () => clearInterval(timer);
    }, [examAttemptId, examSessionId, saveDraft]);
}
