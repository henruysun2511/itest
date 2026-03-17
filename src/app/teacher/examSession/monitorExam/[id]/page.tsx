"use client";

import {
    FileTextOutlined,
    LockOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined, StopOutlined, TeamOutlined,
    ThunderboltOutlined,
    UnlockOutlined,
    UserOutlined
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
import { useState } from 'react';
import MonitoringTab from '../monitoring-tab';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Giả lập trạng thái ca thi (Bạn sẽ thay bằng Enum thực tế)
type SessionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PAUSED' | 'FINISHED';

export default function ProctorDashboardPage({ params }: { params: { id: string } }) {
    const [sessionStatus, setSessionStatus] = useState<SessionStatus>('IN_PROGRESS');
    const [isLocked, setIsLocked] = useState(false);



    // --- Handlers cho API ca thi ---
    const handleToggleLock = () => {
        setIsLocked(!isLocked);
        message.success(isLocked ? "Đã mở khóa ca thi" : "Đã khóa ca thi");
    };

    const handleTogglePause = () => {
        const nextStatus = sessionStatus === 'PAUSED' ? 'IN_PROGRESS' : 'PAUSED';
        setSessionStatus(nextStatus);
        message.warning(nextStatus === 'PAUSED' ? "Đã tạm dừng toàn bộ ca thi" : "Ca thi đã tiếp tục");
    };

    const handleFinishSession = () => {
        Modal.confirm({
            title: 'Kết thúc ca thi?',
            content: 'Tất cả bài làm của thí sinh sẽ được thu hồi và không thể sửa đổi.',
            onOk: () => setSessionStatus('FINISHED'),
        });
    };

    const ExamContentTab = () => (
        <Card className="rounded-xl shadow-sm">
            <Empty description="Tính năng hiển thị nội dung đề thi đang được cập nhật..." />
            {/* Bạn có thể render danh sách câu hỏi hoặc PDF đề thi ở đây */}
        </Card>
    );

    // Tab 3: Danh sách sinh viên (Dạng bảng/List đầy đủ)
    const StudentListTab = () => (
        <Card className="rounded-xl shadow-sm">
            <Title level={4}>Danh sách thí sinh đăng ký trong ca</Title>
            <Text type="secondary">Tổng số: 100 thí sinh</Text>
            {/* Render Table Antd ở đây sẽ rất chuyên nghiệp */}
        </Card>
    );

    const tabItems = [
        {
            key: '1',
            label: <span><ThunderboltOutlined />Theo dõi trực tuyến</span>,
            children: <MonitoringTab />,
        },
        {
            key: '2',
            label: <span><FileTextOutlined />Đề thi</span>,
            children: <ExamContentTab />,
        },
        {
            key: '3',
            label: <span><UserOutlined />Danh sách thí sinh</span>,
            children: <StudentListTab />,
        },
    ];

    return (
        <Layout className="min-h-screen bg-[#f0f2f5]">
            {/* 1. Master Control Header */}
            <Header className="bg-[var(--color-navy-deep)] h-auto py-4 px-6 sticky top-0 z-10 shadow-lg">
                <Row justify="space-between" align="middle">
                    <Col span={8}>
                        <Title level={4} className="!text-white !m-0">
                            <TeamOutlined className="mr-2" /> Ca thi: ES0001
                        </Title>
                        <Text className="text-blue-200">Phòng: Lab 05 • Giám thị: GV. Nguyễn Triết</Text>
                    </Col>

                    <Col span={16} className="text-right">
                        <Space size="middle">
                            <Badge status={sessionStatus === 'IN_PROGRESS' ? 'processing' : 'default'} />
                            <Tag color={sessionStatus === 'IN_PROGRESS' ? 'green' : 'orange'} className="mr-4">
                                {sessionStatus === 'IN_PROGRESS' ? 'ĐANG DIỄN RA' : 'TẠM DỪNG'}
                            </Tag>

                            <Button
                                icon={isLocked ? <UnlockOutlined /> : <LockOutlined />}
                                onClick={handleToggleLock}
                                className={isLocked ? "bg-amber-500 text-white" : ""}
                            >
                                {isLocked ? "Mở khóa" : "Khóa ca thi"}
                            </Button>

                            <Button
                                icon={sessionStatus === 'PAUSED' ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
                                onClick={handleTogglePause}
                                danger={sessionStatus === 'IN_PROGRESS'}
                            >
                                {sessionStatus === 'PAUSED' ? "Tiếp tục" : "Tạm dừng"}
                            </Button>

                            <Button
                                type="primary"
                                danger
                                icon={<StopOutlined />}
                                onClick={handleFinishSession}
                            >
                                Kết thúc & Thu bài
                            </Button>
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