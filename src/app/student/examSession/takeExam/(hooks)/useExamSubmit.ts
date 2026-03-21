import { useSubmitExam } from '@/queries/useExamAttemptQuery';
import { useExamStore } from '@/stores/useExamStore';
import { message, Modal } from 'antd';
import { useRouter } from 'next/navigation';

export function useExamSubmit(
    examSessionId: string,
    userAnswers: any[],
    setIsCameraActive: (val: boolean) => void
) {
    const router = useRouter();
    const { mutate: submitExam, isPending: isSubmitting } = useSubmitExam();
    const setExamResult = useExamStore((state) => state.setExamResult);

    const submitExamAction = () => {
        setIsCameraActive(false);

        const finalAnswers = userAnswers.map((ans) => {
            const val = ans.answer;

            // Mảng (Trắc nghiệm nhiều đáp án)
            if (Array.isArray(val)) {
                return {
                    questionId: ans.questionId,
                    answer: val,
                    file_urls: []
                };
            }

            // Object (Tự luận)
            if (typeof val === 'object' && val !== null && ('content' in val || 'file_metadata' in val)) {
                return {
                    questionId: ans.questionId,
                    answer: val.content || "",
                    file_urls: val.file_metadata?.map((f: any) => f.signedUrl) || []
                };
            }

            // Primitive
            return {
                questionId: ans.questionId,
                answer: String(val ?? ""),
                file_urls: []
            };
        });

        submitExam({
            examSessionId,
            data: { answers: finalAnswers }
        }, {
            onSuccess: (res) => {
                message.success("Nộp bài thành công!");
                const resultData = res.data?.data;
                if (resultData) {
                    setExamResult(resultData);
                }

                localStorage.removeItem(`exam_endtime_${examSessionId}`);
                localStorage.removeItem(`exam_progress_${examSessionId}`);
                router.replace(`/student/examSession/takeExam/${examSessionId}/result`);
            }
        });
    };

    const handleSubmit = (isAutoSubmit = false) => {
        if (isAutoSubmit) {
            message.warning("Đã hết giờ làm bài! Hệ thống đang tự động nộp bài.");
            submitExamAction();
            return;
        }

        Modal.confirm({
            title: 'Xác nhận nộp bài?',
            content: 'Bạn có chắc chắn muốn nộp bài thi không?',
            onOk: submitExamAction
        });
    };

    return { handleSubmit, isSubmitting };
}
