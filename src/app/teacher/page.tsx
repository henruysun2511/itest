"use client";

import {
    BookOutlined,
    CalendarOutlined,
    DatabaseOutlined,
    LogoutOutlined,
    RightOutlined,
    SearchOutlined,
    SolutionOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Badge,
    Button,
    Card,
    Col,
    Divider,
    Input,
    Layout,
    Row,
    Space,
    Tag,
    Typography
} from 'antd';
import { useState } from 'react';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Mock Data giữ nguyên...
const courses = [
    { id: '1', name: 'Lập trình Web nâng cao', code: 'IT4440', sessionCount: 3, color: '#1e2a6d' },
    { id: '2', name: 'Cơ sở dữ liệu', code: 'IT3080', sessionCount: 5, color: '#e6a943' },
    { id: '3', name: 'Trí tuệ nhân tạo', code: 'IT4480', sessionCount: 2, color: '#2e4bcb' },
];

const sessions = [
    { id: 's1', code: 'SESS001', date: '15/05/2024', room: 'Lab 502', status: 'Sắp diễn ra' },
    { id: 's2', code: 'SESS002', date: '18/05/2024', room: 'Hall B1', status: 'Đang mở' },
];

export default function TeacherPage() {
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [currentMenu, setCurrentMenu] = useState('exam-management');

    const userMenuItems = [
        { key: 'profile', label: 'Thông tin cá nhân', icon: <UserOutlined /> },
        { key: 'settings', label: 'Cài đặt tài khoản', icon: <SolutionOutlined /> },
        { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true },
    ];

    return (
        <div className="min-h-screen bg-[#F0F2F5]">

            {/* Hero Header Section */}
            <div className="bg-[var(--color-navy-deep)] h-48 px-12 pt-10">
                <div className="max-w-7xl mx-auto flex justify-between items-start">
                    <div>
                        <Title level={2} className="!text-white !m-0">
                            {currentMenu === 'exam-management' ? 'Quản lý lịch thi & Học phần' : 'Quản trị nội dung'}
                        </Title>
                        <Text className="text-blue-200 opacity-70">Chào buổi sáng, hôm nay bạn có 2 ca thi cần giám sát.</Text>
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
                {currentMenu === 'exam-management' ? (
                    <Row gutter={32}>
                        {/* Left Side: Course List */}
                        <Col lg={selectedCourse ? 9 : 24} className="transition-all duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                                {courses.map((course) => (
                                    <Card
                                        key={course.id}
                                        onClick={() => setSelectedCourse(course.id)}
                                        className={`rounded-[24px] border-none shadow-sm transition-all duration-300 hover:shadow-xl ${selectedCourse === course.id
                                            ? 'bg-white ring-2 ring-[var(--color-accent)]'
                                            : 'bg-white/80 backdrop-blur-md'
                                            }`}
                                        bodyStyle={{ padding: '20px' }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl" style={{ backgroundColor: course.color }}>
                                                <BookOutlined />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.code}</Text>
                                                    <Badge count={course.sessionCount} color={course.color} />
                                                </div>
                                                <Title level={5} className="!m-0 mt-1">{course.name}</Title>
                                            </div>
                                            <RightOutlined className={`text-slate-300 transition-transform ${selectedCourse === course.id ? 'rotate-90 text-[var(--color-accent)]' : ''}`} />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </Col>

                        {/* Right Side: Session Details (Only show when selected) */}
                        {selectedCourse && (
                            <Col lg={15} className="animate-in slide-in-from-right-8 duration-500">
                                <Card className="rounded-[32px] border-none shadow-2xl h-full" bodyStyle={{ padding: '32px' }}>
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <Tag color="blue" className="rounded-md border-none px-3 py-1 text-[10px] font-bold uppercase mb-2">Thông tin lịch thi</Tag>
                                            <Title level={3} className="!m-0">
                                                {courses.find(c => c.id === selectedCourse)?.name}
                                            </Title>
                                        </div>
                                        <Button type="primary" className="bg-[var(--color-navy-main)] rounded-xl h-10 px-6 font-bold">Tải danh sách SV</Button>
                                    </div>

                                    <div className="space-y-4">
                                        {sessions.map(session => (
                                            <div key={session.id} className="group p-5 rounded-[20px] bg-slate-50 border border-transparent hover:border-blue-200 hover:bg-white transition-all flex items-center justify-between">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-[var(--color-navy-main)] shadow-sm group-hover:bg-[var(--color-navy-main)] group-hover:text-white transition-all">
                                                        {session.code.slice(-2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-base text-slate-800 tracking-tight">{session.room}</div>
                                                        <Space className="text-slate-400 text-xs mt-1" split={<span className="opacity-30">|</span>}>
                                                            <span className="flex items-center gap-1"><CalendarOutlined /> {session.date}</span>
                                                            <span className="font-medium text-[var(--color-accent)]">{session.status}</span>
                                                        </Space>
                                                    </div>
                                                </div>
                                                <Button shape="circle" icon={<RightOutlined />} className="border-none bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all" />
                                            </div>
                                        ))}
                                    </div>

                                    <Divider dashed />
                                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
                                        <SolutionOutlined className="text-amber-500 mt-1" />
                                        <Text className="text-amber-800 text-xs italic">
                                            Giảng viên vui lòng có mặt tại phòng thi trước 15 phút để kích hoạt đề thi trên hệ thống.
                                        </Text>
                                    </div>
                                </Card>
                            </Col>
                        )}
                    </Row>
                ) : (
                    <Card className="rounded-[32px] border-none shadow-sm flex flex-col items-center justify-center py-32">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <DatabaseOutlined className="text-4xl text-slate-200" />
                        </div>
                        <Title level={4} className="!text-slate-300">Nội dung đang được cập nhật</Title>
                        <Text className="text-slate-400">Vui lòng quay lại sau ít phút hoặc liên hệ quản trị viên.</Text>
                    </Card>
                )}
            </div>


            <style jsx global>{`
                .teacher-top-menu.ant-menu-horizontal {
                    line-height: 80px;
                    border-bottom: none !important;
                }
                .teacher-top-menu .ant-menu-item {
                    color: rgba(255, 255, 255, 0.7) !important;
                    padding: 0 24px !important;
                    transition: all 0.3s ease !important;
                }
                .teacher-top-menu .ant-menu-item-selected {
                    color: white !important;
                    background: rgba(255, 255, 255, 0.1) !important;
                }
                .teacher-top-menu .ant-menu-item-selected::after {
                    border-bottom: 4px solid var(--color-accent) !important;
                    bottom: 0px !important;
                }
                .ant-layout-header {
                    background: var(--color-navy-deep);
                }
            `}</style>
        </div>
    );
}