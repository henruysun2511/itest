import { useToast } from "@/hooks/useToast";
import { ExamAttemptStatus } from "@/shares/constants/status.enum";
import { FraudLevel } from "@/shares/constants/type.enum";
import { ExamAttempt } from "@/shares/types/object";
import { handleError } from "@/shares/utils/error";
import { getStatusBadge } from "@/shares/utils/mappingLabel";
import {
    AlertOutlined,
    CheckCircleOutlined,
    LogoutOutlined,
    PauseCircleOutlined,
    SaveOutlined,
    ThunderboltOutlined,
    WarningOutlined
} from '@ant-design/icons';
import {
    Badge,
    Card, Col,
    Popconfirm,
    Space,
    Tag, Tooltip, Typography
} from "antd";
const { Text } = Typography;

interface StudentCardProps {
    student: ExamAttempt;
    isWarning?: boolean;
    actions: any;
    onHandleViolation: (data: any) => void;
}

export default function StudentCard({ student, isWarning, actions, onHandleViolation }: StudentCardProps) {
    const toast = useToast();
    const statusInfo = getStatusBadge(student.status);
    const isVio = student.warningCount > 3 || student.fraudLevel === FraudLevel.HIGH;

    // Hàm xử lý chung để toast kết quả từ server
    const handleAction = (actionFn: any, payload: any, actionName: string) => {
        actionFn(payload, {
            onSuccess: (res: any) => {
                toast.success(res?.data?.message || `${actionName} thành công`);
            },
            onError: (err: any) => {
                handleError(err, toast);
            }
        });
    };

    // Kiểm tra xem sinh viên có đang bị tạm dừng không
    const isPaused = student.status === ExamAttemptStatus.PAUSE;
    const isCompleted = student.status === ExamAttemptStatus.COMPLETED;

    return (
        <Col xs={24} sm={12} md={8} lg={6}>
            <Card
                hoverable
                className={`rounded-xl border-2 transition-all duration-300 ${isWarning ? 'border-red-500 bg-red-50' : 'border-transparent'
                    }`}
                bodyStyle={{ padding: 16 }}
                actions={[
                    // 1. Tạm dừng / Tiếp tục (Toggle)
                    <Tooltip title={isPaused ? "Tiếp tục thi" : "Tạm dừng thi"} key="pause">
                        <Popconfirm
                            title={isPaused ? "Cho phép sinh viên tiếp tục làm bài?" : "Tạm dừng bài thi của sinh viên này?"}
                            disabled={isCompleted}
                            onConfirm={() => handleAction(
                                actions.pauseAttempt,
                                { examSessionId: actions.examSessionId, studentId: student.studentId, data: { isPaused: !isPaused } },
                                isPaused ? "Tiếp tục bài thi" : "Tạm dừng bài thi"
                            )}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            {isPaused ? (
                                <CheckCircleOutlined
                                    className={`text-green-500 ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            ) : (
                                <PauseCircleOutlined
                                    className={isCompleted ? 'opacity-50 cursor-not-allowed' : ''}
                                />
                            )}
                        </Popconfirm>
                    </Tooltip>,

                    // 2. Thu bài cưỡng chế
                    <Tooltip title="Thu bài cưỡng chế" key="force">
                        <Popconfirm
                            title="Xác nhận thu bài cưỡng chế?"
                            description="Hành động này sẽ kết thúc bài thi của sinh viên ngay lập tức."
                            disabled={isCompleted}
                            onConfirm={() => handleAction(
                                actions.forceSubmit,
                                { examSessionId: actions.examSessionId, data: { studentIds: [student.studentId], studentCodes: [student.studentCode] } },
                                "Thu bài"
                            )}
                            okText="Thu bài"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                        >
                            <LogoutOutlined
                                className={`text-red-500 ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </Popconfirm>
                    </Tooltip>,

                    // 3. Lưu bài làm
                    <Tooltip title="Lưu bài làm" key="save">
                        <Popconfirm
                            title="Lưu trạng thái bài làm?"
                            description="Hệ thống sẽ đồng bộ dữ liệu bài làm hiện tại của sinh viên."
                            disabled={isCompleted}
                            onConfirm={() => handleAction(
                                actions.saveAnswers,
                                {
                                    examSessionId: actions.examSessionId,
                                    data: { studentId: student.studentId, studentCode: student.studentCode }
                                },
                                "Lưu bài"
                            )}
                            okText="Lưu"
                            cancelText="Hủy"
                        >
                            <SaveOutlined
                                className={isCompleted ? 'opacity-50 cursor-not-allowed' : ''}
                            />
                        </Popconfirm>
                    </Tooltip>,

                    // 4. Cho phép thi lại
                    <Tooltip title="Cho phép thi lại" key="retake">
                        <Popconfirm
                            title="Xác nhận cho phép thi lại?"
                            description="Sinh viên sẽ được cấp quyền làm lại bài thi này."
                            onConfirm={() => handleAction(
                                actions.grantRetake,
                                {
                                    studentId: student.studentId,
                                    studentCode: student.studentCode,
                                    examSessionId: actions.examSessionId
                                },
                                "Cấp quyền thi lại"
                            )}
                            okText="Đồng ý"
                            cancelText="Hủy"
                        >
                            <ThunderboltOutlined className="text-amber-500" />
                        </Popconfirm>
                    </Tooltip>,

                    <Tooltip title="Xử lý vi phạm" key="violation">
                        <AlertOutlined
                            className="text-red-600"
                            onClick={() => onHandleViolation({
                                studentId: student.studentId,
                                fullName: student.fullName,
                                examAttemptId: student.examAttemptId,
                                examSessionId: actions.examSessionId
                            })}
                        />
                    </Tooltip>
                ]}
            >
                <div className="flex justify-between items-start mb-3">
                    <Space direction="vertical" size={0}>
                        <Text strong className="text-base truncate block" style={{ maxWidth: 150 }}>
                            {student.fullName}
                        </Text>
                        <Text type="secondary" className="text-xs">{student.studentCode}</Text>
                    </Space>

                    {/* Badge trạng thái với màu động */}
                    <Badge status={statusInfo.status as any} />
                </div>

                <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">IP: {student.ip}</span>

                        {/* Label tiếng Việt với màu tương ứng */}
                        <Tag
                            color={statusInfo.color}
                            className="m-0 border-none px-2 rounded-md font-medium"
                        >
                            {statusInfo.label}
                        </Tag>
                    </div>
                </div>

                {/* Phần hiển thị vi phạm */}
                {student.warningCount > 0 && (
                    <Tag color="error" icon={<WarningOutlined />} className="w-full text-center m-0 py-1 rounded-lg">
                        Vi phạm: {student.warningCount} lần
                    </Tag>
                )}

                {/* Nếu đã nộp bài thì thêm thông tin thời gian nộp (nếu có) */}
                {student.status === ExamAttemptStatus.COMPLETED && (
                    <div className="mt-2 text-[10px] text-center text-green-600 font-medium italic">
                        <CheckCircleOutlined /> Đã thu bài hệ thống
                    </div>
                )}
            </Card>
        </Col >
    );
}