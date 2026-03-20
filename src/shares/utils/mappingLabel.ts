import { ExamAttemptStatus, ExamSessionStatus, ResultStatus } from "../constants/status.enum";
import { FraudLevel, FraudType, ProctoringHandleType, QuestionType, RoleType } from "../constants/type.enum";

// 1. Đồng bộ nhãn loại câu hỏi
export const getQuestionTypeLabel = (type: string) => {
    switch (type?.toUpperCase()) {
        case QuestionType.SINGLE_CHOICE: 
            return { label: 'Trắc nghiệm (1 đáp án)', color: 'blue' };
        case QuestionType.MULTIPLE_CHOICE: 
            return { label: 'Chọn nhiều đáp án', color: 'purple' };
        case QuestionType.TRUE_FALSE: 
            return { label: 'Đúng / Sai', color: 'cyan' };
        case QuestionType.ESSAY: 
            return { label: 'Câu hỏi Tự luận', color: 'orange' };
        case QuestionType.FILL_IN_THE_BLANK: 
            return { label: 'Điền vào chỗ trống', color: 'green' };
        default: 
            return { label: 'Câu hỏi', color: 'default' };
    }
};

// 2. Đồng bộ trạng thái bài làm (Attempt)
export const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
        case ExamAttemptStatus.IN_PROGRESS:
            return { label: 'Đang làm bài', color: 'blue', status: 'processing' };
        case ExamAttemptStatus.COMPLETED:
            return { label: 'Đã hoàn thành', color: 'green', status: 'success' };
        case ExamAttemptStatus.PAUSE:
            return { label: 'Đang tạm dừng', color: 'orange', status: 'warning' };
        case ExamAttemptStatus.DISCONNECTED:
            return { label: 'Mất kết nối', color: 'red', status: 'error' };
        default:
            return { label: 'Chưa bắt đầu', color: 'default', status: 'default' };
    }
};

// 3. Đồng bộ Badge vai trò người dùng
export const getRoleBadge = (role: string) => {
    switch (role?.toUpperCase()) {
        case RoleType.ADMIN:
            return { label: 'Quản trị viên', color: 'red', status: 'error' };
        case RoleType.TEACHER:
            return { label: 'Giảng viên', color: 'blue', status: 'processing' };
        case RoleType.STUDENT:
            return { label: 'Sinh viên', color: 'green', status: 'success' };
        default:
            return { label: 'Khách', color: 'default', status: 'default' };
    }
};

// 4. Đồng bộ trạng thái vi phạm (Fraud) - Dùng mã màu Hex cho UI đẹp hơn
export const getFraudTypeBadge = (type: string) => {
    const config: Record<string, { label: string, color: string, bgColor: string, borderColor: string }> = {
        [FraudType.FACE_MISMATCH]: {
            label: 'Sai khác khuôn mặt',
            color: '#d32f2f',
            bgColor: '#fdecea',
            borderColor: '#f5c6cb'
        },
        [FraudType.MULTIPLE_FACES_DETECTED]: {
            label: 'Nhiều khuôn mặt',
            color: '#b71c1c',
            bgColor: '#fdecea',
            borderColor: '#f1aeb5'
        },
        [FraudType.NO_FACE_DETECTED]: {
            label: 'Không thấy khuôn mặt',
            color: '#ed6c02',
            bgColor: '#fff4e5',
            borderColor: '#ffcc80'
        },
        [FraudType.TAB_SWITCHING]: {
            label: 'Chuyển Tab',
            color: '#1565c0',
            bgColor: '#e3f2fd',
            borderColor: '#90caf9'
        },
        [FraudType.WINDOW_BLUR]: {
            label: 'Rời cửa sổ thi',
            color: '#00695c',
            bgColor: '#e0f2f1',
            borderColor: '#80cbc4'
        },
        [FraudType.IP_CHANGED]: {
            label: 'Thay đổi IP',
            color: '#0277bd',
            bgColor: '#e1f5fe',
            borderColor: '#81d4fa'
        },
        [FraudType.NETWORK_DISRUPTION]: {
            label: 'Mất kết nối mạng',
            color: '#f9a825',
            bgColor: '#fffde7',
            borderColor: '#fff59d'
        }
    };

    return config[type?.toUpperCase()] || {
        label: 'Vi phạm khác',
        color: '#424242',
        bgColor: '#f5f5f5',
        borderColor: '#e0e0e0'
    };
};

// 5. Đồng bộ trạng thái xử lý vi phạm (Handling)
export const getHandlingTypeBadge = (type: string) => {
    switch (type?.toUpperCase()) {
        case ProctoringHandleType.WARNING:
            return { label: "Cảnh cáo", color: "orange", status: "warning" };
        case ProctoringHandleType.REPRIMAND:
            return { label: "Khiển trách", color: "gold", status: "warning" };
        case ProctoringHandleType.STOP_FOR_SESSION_TRANSFER:
            return { label: "Dừng thi chuyển ca", color: "volcano", status: "error" };
        case ProctoringHandleType.SUSPENSION:
            return { label: "Đình chỉ thi", color: "red", status: "error" };
        default:
            return { label: "Bình thường", color: "default", status: "default" };
    }
};

// 6. Đồng bộ trạng thái ca thi (Session)
export const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
        case ExamSessionStatus.IN_PROGRESS:
            return { color: '#16a34a', text: 'Đang diễn ra', label: 'Vào thi ngay', status: 'success' };
        case ExamSessionStatus.NOT_STARTED:
            return { color: '#e6a943', text: 'Sắp diễn ra', label: 'Chưa mở', status: 'warning' };
        case ExamSessionStatus.FINISHED:
            return { color: '#6b7280', text: 'Đã đóng', label: 'Đã kết thúc', status: 'default' };
        default:
            return { color: '#6b7280', text: 'Không xác định', label: 'Liên hệ GV', status: 'default' };
    }
};

export const getResultStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
        case ResultStatus.PUBLISHED:
            return { label: 'Đã công bố', color: 'green', status: 'success' };
        case ResultStatus.NOT_GRADED:
            return { label: 'Chưa chấm', color: 'orange', status: 'warning' };
        default:
            return { label: 'Không xác định', color: 'default', status: 'default' };
    }
};
// --- OPTIONS CHO CÁC COMPONENT SELECT/FILTER ---

export const STATUS_OPTIONS = [
    { label: 'Tất cả trạng thái', value: undefined },
    { label: 'Đang làm bài', value: ExamAttemptStatus.IN_PROGRESS },
    { label: 'Tạm dừng', value: ExamAttemptStatus.PAUSE },
    { label: 'Đã hoàn thành', value: ExamAttemptStatus.COMPLETED },
    { label: 'Mất kết nối', value: ExamAttemptStatus.DISCONNECTED },
];

export const FRAUD_OPTIONS = [
    { label: 'Tất cả mức độ', value: undefined },
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