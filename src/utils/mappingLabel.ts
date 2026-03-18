import { ExamAttemptStatus, FraudLevel, FraudType, ProctoringHandleType, QuestionType } from "@/types/enum";

export const getQuestionTypeLabel = (type: string) => {
    switch (type?.toUpperCase()) {
        case QuestionType.SINGLE_CHOICE: return { label: 'Trắc nghiệm (1 đáp án)', color: 'blue' };
        case QuestionType.MULTIPLE_CHOICE: return { label: 'Chọn nhiều đáp án', color: 'purple' };
        case QuestionType.TRUE_FALSE: return { label: 'Đúng / Sai', color: 'cyan' };
        case QuestionType.ESSAY: return { label: 'Câu hỏi Tự luận', color: 'orange' };
        case QuestionType.FILL_IN_THE_BLANK: return { label: 'Điền vào chỗ trống', color: 'green' };
        default: return { label: 'Câu hỏi', color: 'default' };
    }
};

export const getStatusBadge = (status: string) => {
    switch (status) {
        case ExamAttemptStatus.IN_PROGRESS:
            return { label: 'Đang làm bài', color: 'blue', status: 'processing' };
        case ExamAttemptStatus.COMPLETED:
            return { label: 'Đã hoàn thành', color: 'green', status: 'success' };
        case ExamAttemptStatus.PAUSE:
            return { label: 'Đang tạm dừng', color: 'orange', status: 'warning' };
        case ExamAttemptStatus.DISCONNECTED:
            return { label: 'Mất kết nối', color: 'red', status: 'error' };
        default:
            return { label: 'Chưa bắt đầu', color: 'gray', status: 'default' };
    }
};

export const getFraudTypeBadge = (type: string) => {
    switch (type?.toUpperCase()) {
        case FraudType.FACE_MISMATCH:
            return {
                label: 'Sai khác khuôn mặt',
                color: '#d32f2f',
                bgColor: '#fdecea',
                borderColor: '#f5c6cb'
            };

        case FraudType.MULTIPLE_FACES_DETECTED:
            return {
                label: 'Nhiều khuôn mặt',
                color: '#b71c1c',
                bgColor: '#fdecea',
                borderColor: '#f1aeb5'
            };

        case FraudType.NO_FACE_DETECTED:
            return {
                label: 'Không thấy khuôn mặt',
                color: '#ed6c02',
                bgColor: '#fff4e5',
                borderColor: '#ffcc80'
            };

        case FraudType.TAB_SWITCHING:
            return {
                label: 'Chuyển Tab',
                color: '#1565c0',
                bgColor: '#e3f2fd',
                borderColor: '#90caf9'
            };

        case FraudType.WINDOW_BLUR:
            return {
                label: 'Rời cửa sổ thi',
                color: '#00695c',
                bgColor: '#e0f2f1',
                borderColor: '#80cbc4'
            };

        case FraudType.IP_CHANGED:
            return {
                label: 'Thay đổi IP',
                color: '#0277bd',
                bgColor: '#e1f5fe',
                borderColor: '#81d4fa'
            };

        case FraudType.NETWORK_DISRUPTION:
            return {
                label: 'Mất kết nối mạng',
                color: '#f9a825',
                bgColor: '#fffde7',
                borderColor: '#fff59d'
            };

        default:
            return {
                label: 'Vi phạm khác',
                color: '#424242',
                bgColor: '#f5f5f5',
                borderColor: '#e0e0e0'
            };
    }
};

export const STATUS_OPTIONS = [
    { label: 'Tất cả trạng thái', value: undefined },
    { label: 'Đang làm bài', value: ExamAttemptStatus.IN_PROGRESS },
    { label: 'Tạm dừng', value: ExamAttemptStatus.PAUSE },
    { label: 'Đã hoàn thành', value: ExamAttemptStatus.COMPLETED },
    { label: 'Mất kết nối', value: ExamAttemptStatus.DISCONNECTED },
];

export const FRAUD_OPTIONS = [
    { label: 'Tất cả mức độ vi phạm', value: undefined },
    { label: 'Thấp', value: FraudLevel.LOW },
    { label: 'Trung bình', value: FraudLevel.MEDIUM },
    { label: 'Cao', value: FraudLevel.HIGH },
];

export const PROCTORING_OPTIONS = [
    { label: 'Cảnh báo', value: ProctoringHandleType.WARNING },
    { label: 'Khiển trách', value: ProctoringHandleType.REPRIMAND },
    { label: 'Đình chỉ thi', value: ProctoringHandleType.SUSPENSION },
    { label: 'Dừng để chuyển ca', value: ProctoringHandleType.STOP_FOR_SESSION_TRANSFER },
];