"use client";

import {
    FileTextOutlined,
    LockOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined, StopOutlined, TeamOutlined,
    ThunderboltOutlined,
    UnlockOutlined,
    UserOutlined,
    WarningOutlined
} from '@ant-design/icons';
import {
    Badge,
    Button,
    Card,
    Col,
    Empty,
    Layout,
    Modal,
    Row,
    Space,
    Tabs,
    Tag,
    Typography,
    message
} from 'antd';
import { useParams } from 'next/navigation';
import MonitoringTab from '../(components)/monitoring-tab';

// Import Hooks của bạn
import { ExamSessionStatus } from '@/constants/status.enum';
import {
    useExamSessionChangeStatus,
    useExamSessionClose,
    useExamSessionDetail,
    useExamSessionLock,
    useExamSessionPause
} from "@/queries/useExamSessionQuery";
import FraudLogTab from '../(components)/fraud-log-tab';
import MonitoringTableTab from '../(components)/monitoring-table-tab';
import StudentListTab from '../(components)/student-list-tab';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function ProctorDashboardPage() {
    const { id: examSessionId } = useParams<{ id: string }>();


    // 1. Lấy thông tin ca thi hiện tại từ cache/API
    const { data: currentSessionRes, isLoading } = useExamSessionDetail(examSessionId);
    console.log(currentSessionRes)
    const currentSession = currentSessionRes?.data;

    // 2. Khai báo các Mutation Hooks
    const lockMutation = useExamSessionLock();
    const pauseMutation = useExamSessionPause();
    const closeMutation = useExamSessionClose();
    const changeStatusMutation = useExamSessionChangeStatus();

    // Lấy trạng thái từ database (nếu không có thì dùng mặc định)
    const isLocked = currentSession?.isLocked ?? false;
    const sessionStatus = currentSession?.status ?? ExamSessionStatus.NOT_STARTED;
    const isPaused = sessionStatus === ExamSessionStatus.PAUSE;


    // --- Các hàm xử lý tương tác ---
    const handleToggleLock = () => {
        lockMutation.mutate(
            { id: examSessionId, isLocked: !isLocked },
            {
                onSuccess: () => message.success(!isLocked ? "Đã khóa ca thi" : "Đã mở khóa ca thi"),
                onError: () => message.error("Không thể thay đổi trạng thái khóa")
            }
        );
    };

    const handleTogglePause = () => {
        pauseMutation.mutate(
            { id: examSessionId, isPaused: !isPaused },
            {
                onSuccess: () => {
                    const msg = !isPaused ? "Đã tạm dừng ca thi" : "Ca thi đã tiếp tục";
                    message.warning(msg);
                },
                onError: (err) => message.error("Lỗi: " + err.message)
            }
        );
    };

    const handleFinishSession = () => {
        Modal.confirm({
            title: 'Kết thúc ca thi?',
            content: 'Tất cả bài làm của thí sinh sẽ được thu hồi và không thể sửa đổi.',
            okText: 'Xác nhận kết thúc',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => {
                closeMutation.mutate(examSessionId, {
                    onSuccess: () => message.success("Đã kết thúc ca thi và thu bài thành công"),
                    onError: () => message.error("Lỗi khi kết thúc ca thi")
                });
            },
        });
    };

    const handleStartSession = () => {
        Modal.confirm({
            title: 'Bắt đầu ca thi?',
            content: 'Thí sinh sẽ có thể bắt đầu làm bài sau khi ca thi được kích hoạt.',
            okText: 'Bắt đầu ngay',
            onOk: () => {
                changeStatusMutation.mutate(
                    {
                        id: examSessionId,
                        data: { status: ExamSessionStatus.IN_PROGRESS }
                    },
                    {
                        onSuccess: () => message.success("Ca thi đã chính thức bắt đầu!"),
                        onError: () => message.error("Không thể bắt đầu ca thi.")
                    }
                );
            },
        });
    };

    const ExamContentTab = () => (
        <Card className="rounded-xl shadow-sm">
            <Empty description="Tính năng hiển thị nội dung đề thi đang được cập nhật..." />
        </Card>
    );


    const tabItems = [
        {
            key: '1',
            label: <span><ThunderboltOutlined />Theo dõi trực tuyến</span>,
            children: <MonitoringTab examSessionId={examSessionId} />,
        },
        {
            key: '2',
            label: <span><FileTextOutlined /> Danh sách chi tiết (Table)</span>,
            children: <MonitoringTableTab examSessionId={examSessionId} />,
        },
        {
            key: '3',
            label: <span><WarningOutlined /> Nhật ký vi phạm</span>,
            children: <FraudLogTab examSessionId={examSessionId} />,
        },
        {
            key: '4',
            label: <span><UserOutlined />Danh sách thí sinh</span>,
            children: <StudentListTab examSessionId={examSessionId} />,
        },
        {
            key: '5',
            label: <span><FileTextOutlined />Đề thi</span>,
            children: <ExamContentTab />,
        },
    ];

    return (
        <Layout className="min-h-screen bg-[#f0f2f5]">
            <Header className="bg-[var(--color-navy-deep)] h-auto py-4 px-6 sticky top-0 z-10 shadow-lg">
                <Row justify="space-between" align="middle">
                    <Col span={8}>
                        <Title level={4} className="!text-white !m-0">
                            <TeamOutlined className="mr-2" /> Ca thi: {currentSession?.examSessionCode || "..."}
                        </Title>
                        <Text className="text-blue-200">Phòng: {currentSession?.room} • Giám thị: {currentSession?.teacherNames?.join(', ') || "Chưa phân công"}</Text>
                    </Col>

                    <Col span={16} className="text-right">
                        <Space size="middle">
                            <Badge status={sessionStatus === ExamSessionStatus.IN_PROGRESS ? 'processing' : 'default'} />
                            <Tag color={
                                sessionStatus === ExamSessionStatus.IN_PROGRESS ? 'green' :
                                    sessionStatus === ExamSessionStatus.NOT_STARTED ? 'blue' : 'orange'
                            } className="mr-4">
                                {sessionStatus}
                            </Tag>

                            {/* NÚT BẮT ĐẦU: Chỉ hiển thị khi trạng thái là NOT_STARTED */}
                            {sessionStatus === ExamSessionStatus.NOT_STARTED && (
                                <Button
                                    type="primary"
                                    icon={<PlayCircleOutlined />}
                                    onClick={handleStartSession}
                                    loading={changeStatusMutation.isPending}
                                    className="bg-blue-600"
                                >
                                    Bắt đầu ca thi
                                </Button>
                            )}

                            {/* CÁC NÚT ĐIỀU KHIỂN KHÁC: Chỉ hiện khi đã bắt đầu hoặc đang tạm dừng */}
                            {sessionStatus !== ExamSessionStatus.NOT_STARTED && sessionStatus !== ExamSessionStatus.FINISHED && (
                                <>
                                    <Button
                                        icon={isLocked ? <UnlockOutlined /> : <LockOutlined />}
                                        onClick={handleToggleLock}
                                        loading={lockMutation.isPending}
                                        className={isLocked ? "bg-amber-500 text-white" : ""}
                                    >
                                        {isLocked ? "Mở khóa" : "Khóa ca thi"}
                                    </Button>

                                    <Button
                                        icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
                                        onClick={handleTogglePause}
                                        loading={pauseMutation.isPending}
                                        danger={!isPaused}
                                    >
                                        {isPaused ? "Tiếp tục" : "Tạm dừng"}
                                    </Button>

                                    <Button
                                        type="primary"
                                        danger
                                        icon={<StopOutlined />}
                                        onClick={handleFinishSession}
                                        loading={closeMutation.isPending}
                                    >
                                        Kết thúc & Thu bài
                                    </Button>
                                </>
                            )}
                        </Space>
                    </Col>
                </Row>
            </Header>

            <Content className="py-6 px-12">
                <div className="max-w-7xl mx-auto">
                    <Tabs
                        defaultActiveKey="1"
                        items={tabItems}
                        size="large"
                        type="card"
                        className="custom-proctor-tabs"
                    />
                </div>
            </Content>
        </Layout>
    );
}