"use client";

import {
    BellOutlined,
    BookOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    InfoCircleOutlined,
    LoginOutlined,
    LogoutOutlined,
    SearchOutlined,
    SolutionOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Col, Dropdown, Input, Layout, Row, Space, Typography } from 'antd';

const { Title, Text } = Typography;
const { Header, Content } = Layout;


interface ExamSession {
    id: string;
    courseName: string;
    examName: string;
    startTime: string;
    duration: number; // phút
    room: string;
    status: 'available' | 'upcoming' | 'closed';
}

export default function StudentExamHome() {
    // Dữ liệu mẫu cho sinh viên
    const sessions: ExamSession[] = [
        {
            id: '1',
            courseName: 'Tiếng Anh chuyên ngành IT',
            examName: 'Thi cuối kỳ - Học kỳ 2',
            startTime: '2024-05-20 08:00',
            duration: 90,
            room: 'Phòng thi trực tuyến A1',
            status: 'available', // Đã đến giờ, có thể bấm vào thi
        },
        {
            id: '2',
            courseName: 'Lập trình hướng đối tượng',
            examName: 'Kiểm tra giữa kỳ',
            startTime: '2024-05-22 14:00',
            duration: 60,
            room: 'Phòng thực hành PM2',
            status: 'upcoming', // Chưa đến giờ
        },
        {
            id: '3',
            courseName: 'Cơ sở dữ liệu',
            examName: 'Thi bù đợt 1',
            startTime: '2024-05-18 09:00',
            duration: 90,
            room: 'Phòng 302 - Nhà C',
            status: 'closed', // Đã kết thúc
        }
    ];

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'available': return { color: '#16a34a', text: 'Đang diễn ra', label: 'Vào thi ngay' };
            case 'upcoming': return { color: '#e6a943', text: 'Sắp diễn ra', label: 'Chưa mở' };
            default: return { color: '#6b7280', text: 'Đã đóng', label: 'Đã kết thúc' };
        }
    };

    const currentMenu = "";
    const userMenuItems = [
        { key: 'profile', label: 'Thông tin cá nhân', icon: <UserOutlined /> },
        { key: 'settings', label: 'Cài đặt tài khoản', icon: <SolutionOutlined /> },
        { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true },
    ];

    return (
        <Layout className="min-h-screen bg-[#F0F2F5]">
            {/* Top Navigation Bar - Khác biệt hoàn toàn với Admin Sidebar */}
            <Header className="bg-[var(--color-navy-deep)] h-20 flex items-center justify-between px-8 sticky top-0 z-[100] border-b border-white/10">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-[var(--color-accent)] rounded-lg flex items-center justify-center font-black text-[var(--color-navy-deep)] shadow-lg shadow-orange-500/20">i</div>
                        <span className="text-white font-bold text-xl tracking-tighter">iTEST STUDENT</span>
                    </div>

                </div>

                <div className="flex items-center gap-6">
                    <Badge dot color="var(--color-accent)">
                        <BellOutlined className="text-white text-xl cursor-pointer opacity-70 hover:opacity-100" />
                    </Badge>
                    <div className="h-8 w-[1px] bg-white/20"></div>
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                        <div className="flex items-center gap-3 cursor-pointer group px-2 py-1 rounded-lg hover:bg-white/5 transition-all">
                            <div className="flex flex-col items-end justify-center">
                                <div className="text-white font-bold leading-tight text-sm group-hover:text-[var(--color-accent)] transition-colors">
                                    Đặng Nhật Huy
                                </div>
                                <span className="text-blue-300 text-[10px] uppercase font-bold tracking-wider leading-none mt-1">
                                    Sinh viên
                                </span>
                            </div>
                            <Avatar
                                size={42}
                                icon={<UserOutlined />}
                                className="bg-white/10 border border-white/20 group-hover:border-[var(--color-accent)] transition-all flex-shrink-0"
                            />
                        </div>
                    </Dropdown>
                </div>
            </Header>

            <Content className="p-0">
                {/* Hero Header Section */}
                <div className="bg-[var(--color-navy-deep)] h-48 px-12 pt-10">
                    <div className="max-w-7xl mx-auto flex justify-between items-start">
                        <div>
                            <Title level={2} className="!text-white !m-0">
                                Danh sách ca thi
                            </Title>
                            <Text className="text-blue-200 opacity-70">Mày vào nhanh</Text>
                        </div>
                        <Input
                            placeholder="Tìm nhanh học phần..."
                            prefix={<SearchOutlined />}
                            className="w-72 h-11 rounded-xl bg-white border-none text-black placeholder:text-blue-300 focus:bg-white focus:text-black transition-all"
                        />
                    </div>
                </div>

                {/* Main Content Area - Overlapping Card Style */}
                <div className="max-w-7xl mx-auto px-12 -mt-16 pb-20">
                    <Row gutter={[24, 24]}>
                        {sessions.map((session) => {
                            const config = getStatusConfig(session.status);
                            return (
                                <Col xs={24} sm={12} lg={8} key={session.id}>
                                    <Badge.Ribbon text={config.text} color={config.color}>
                                        <Card
                                            hoverable
                                            className="rounded-2xl border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                                            bodyStyle={{ padding: '24px' }}
                                        >
                                            <div className="flex flex-col h-full">
                                                {/* Course Icon & Name */}
                                                <div className="mb-4">
                                                    <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                                                        <BookOutlined className="text-2xl text-[var(--color-navy-main)]" />
                                                    </div>
                                                    <Title level={5} className="!m-0 line-clamp-1 text-[var(--color-navy-main)]">
                                                        {session.courseName}
                                                    </Title>
                                                    <Text className="text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                                                        {session.examName}
                                                    </Text>
                                                </div>

                                                {/* Info Details */}
                                                <Space direction="vertical" className="w-full mb-6 text-[var(--color-text-secondary)]">
                                                    <div className="flex items-center gap-2">
                                                        <ClockCircleOutlined className="text-[var(--color-accent)]" />
                                                        <span>Bắt đầu: <b>{session.startTime}</b></span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <InfoCircleOutlined className="text-blue-400" />
                                                        <span>Thời gian làm bài: <b>{session.duration} phút</b></span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <EnvironmentOutlined className="text-red-400" />
                                                        <span>Phòng thi: <b>{session.room}</b></span>
                                                    </div>
                                                </Space>

                                                {/* Action Button */}
                                                <Button
                                                    type={session.status === 'available' ? 'primary' : 'default'}
                                                    block
                                                    size="large"
                                                    icon={<LoginOutlined />}
                                                    disabled={session.status !== 'available'}
                                                    className={`rounded-xl font-bold h-12 flex items-center justify-center transition-all ${session.status === 'available'
                                                        ? 'bg-[var(--color-navy-main)] hover:bg-[var(--color-navy-light)] border-none'
                                                        : 'bg-gray-100 text-gray-400'
                                                        }`}
                                                >
                                                    {config.label}
                                                </Button>
                                            </div>
                                        </Card>
                                    </Badge.Ribbon>
                                </Col>
                            );
                        })}
                    </Row>


                </div>
            </Content>
        </Layout>
    );
}