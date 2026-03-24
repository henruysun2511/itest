import { useSubmitExam } from "@/queries/useExamAttemptQuery";
import { useExamStore } from "@/stores/useExamStore";
import { message, Modal } from "antd";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export function useExamSubmit(
  examSessionId: string,
  userAnswers: any[],
  setIsCameraActive: (val: boolean) => void,
) {
  const router = useRouter();
  const { mutate: submitExam, isPending: isSubmitting } = useSubmitExam();
  const setExamResult = useExamStore((state) => state.setExamResult);
  const isSubmittedRef = useRef(false);

  const submitExamAction = () => {
    // Nếu đang trong quá trình nộp thì không làm gì
    if (isSubmitting) return;

    isSubmittedRef.current = true;
    setIsCameraActive(false);

    // Xóa cache local ngay khi nộp
    localStorage.removeItem(`exam_endtime_${examSessionId}`);
    localStorage.removeItem(`exam_progress_${examSessionId}`);

    const finalAnswers = userAnswers.map((ans) => {
      const val = ans.answer;
      if (Array.isArray(val)) {
        return { questionId: ans.questionId, answer: val, file_urls: [] };
      }
      if (
        typeof val === "object" &&
        val !== null &&
        ("content" in val || "file_metadata" in val)
      ) {
        return {
          questionId: ans.questionId,
          answer: val.content || "",
          file_urls: val.file_metadata?.map((f: any) => f.signedUrl) || [],
        };
      }
      return {
        questionId: ans.questionId,
        answer: String(val ?? ""),
        file_urls: [],
      };
    });

    submitExam(
      {
        examSessionId,
        data: { answers: finalAnswers },
      },
      {
        onSuccess: (res) => {
          message.success({
            content: "Nộp bài thành công!",
            key: "submit-status",
          });
          const resultData = res.data?.data;
          if (resultData) setExamResult(resultData);
          router.replace(
            `/student/examSession/takeExam/${examSessionId}/result`,
          );
        },
        onError: (error: any) => {
          if (error.response?.status === 401) {
            message.error({
              content: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.",
              key: "submit-status",
            });
          } else {
            message.error({
              content: "Lỗi nộp bài, vui lòng nhấn nộp lại!",
              key: "submit-status",
            });
            // Cho phép thử lại bằng tay sau 2 giây
            setTimeout(() => {
              isSubmittedRef.current = false;
            }, 2000);
          }
        },
      },
    );
  };

  const handleSubmit = (isAutoSubmit = false) => {
    // Nếu đã nộp hoặc đang nộp thì block
    if (isSubmittedRef.current || isSubmitting) return;

    if (isAutoSubmit) {
      isSubmittedRef.current = true;
      message.warning({
        content: "Đã hết giờ làm bài! Hệ thống đang tự động nộp bài.",
        key: "submit-status",
        duration: 0, // Giữ message cho đến khi nộp xong hoặc lỗi
      });
      submitExamAction();
      return;
    }

    Modal.confirm({
      title: "Xác nhận nộp bài?",
      content: "Bạn có chắc chắn muốn nộp bài thi không?",
      onOk: submitExamAction,
      okButtonProps: { loading: isSubmitting },
    });
  };

  return { handleSubmit, isSubmitting };
}
