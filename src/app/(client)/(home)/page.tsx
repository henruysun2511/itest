"use client";

import {
    ArrowRightOutlined,
    LoginOutlined,
    ScanOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Card, Col, Row, Tag, Typography } from 'antd';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

interface DemoPage {
    title: string;
    description: string;
    path: string;
    icon: React.ReactNode;
    color: string;
    tag: string;
}

export default function DemoNavigationHub() {
    const router = useRouter();

    const pages: DemoPage[] = [
        {
            title: "Trang Giáo viên",
            description: "Quản lý ngân hàng câu hỏi, tạo đề thi và theo dõi kết quả học tập của lớp.",
            path: "/teacher",
            icon: <UserOutlined />,
            color: "from-blue-600 to-indigo-700",
            tag: "Management"
        },
        {
            title: "Trang Sinh viên",
            description: "Xem lịch thi, làm bài trắc nghiệm trực tuyến và xem lịch sử điểm số.",
            path: "/student",
            icon: <TeamOutlined />,
            color: "from-emerald-500 to-teal-700",
            tag: "Learning"
        },
        {
            title: "Trang Admin",
            description: "Hệ thống quản trị tổng thể: Quản lý người dùng, phân quyền và cấu hình hệ thống.",
            path: "/admin/overview",
            icon: <SettingOutlined />,
            color: "from-slate-700 to-slate-900",
            tag: "System"
        },
        {
            title: "Trang Đăng nhập",
            description: "Giao diện xác thực người dùng với các hiệu ứng chuyển cảnh mượt mà.",
            path: "/auth/login",
            icon: <LoginOutlined />,
            color: "from-orange-400 to-pink-600",
            tag: "Auth"
        },
        {
            title: "Xác thực Khuôn mặt",
            description: "Demo công nghệ AI nhận diện khuôn mặt để chống gian lận trong phòng thi.",
            path: "/examSession/verifyFace/1",
            icon: <ScanOutlined />,
            color: "from-violet-500 to-purple-800",
            tag: "AI Tech"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8 md:p-16">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-16 text-center">
                    <Text className="text-[var(--color-accent)] font-bold uppercase tracking-[0.3em] mb-4 block">
                        Main Portal
                    </Text>
                    <Title level={1} className="!text-[var(--color-navy-deep)] !font-black !m-0 md:text-5xl">
                        Demo giao diện Hệ thống Quản lý Thi Trực tuyến
                    </Title>
                    <div className="h-1.5 w-24 bg-[var(--color-accent)] mx-auto mt-6 rounded-full"></div>
                    <Text className="text-slate-500 mt-6 block text-lg max-w-2xl mx-auto">
                        Chào mừng bạn đến với bản Demo. Vui lòng chọn một phân hệ bên dưới để trải nghiệm các tính năng của hệ thống.
                    </Text>
                </div>

                {/* Grid Cards */}
                <Row gutter={[32, 32]}>
                    {pages.map((page, index) => (
                        <Col xs={24} md={12} lg={8} key={index}>
                            <Card
                                hoverable
                                onClick={() => router.push(page.path)}
                                className="h-full border-none rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/60 group transition-all duration-500 hover:-translate-y-3"
                                bodyStyle={{ padding: 0 }}
                            >
                                <div className="flex flex-col h-full">
                                    {/* Top Gradient Section */}
                                    <div className={`h-32 bg-gradient-to-br ${page.color} flex items-center justify-center relative overflow-hidden`}>
                                        <div className="absolute inset-0 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                            <div className="absolute top-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12"></div>
                                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-black rounded-full translate-x-16 translate-y-16"></div>
                                        </div>
                                        <div className="text-white text-5xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                            {page.icon}
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex justify-between items-center mb-4">
                                            <Tag className="m-0 border-none bg-slate-100 text-slate-500 font-bold rounded-full px-4 py-0.5">
                                                {page.tag}
                                            </Tag>
                                            <ArrowRightOutlined className="text-slate-300 group-hover:text-[var(--color-accent)] group-hover:translate-x-2 transition-all" />
                                        </div>

                                        <Title level={4} className="!mb-3 group-hover:text-indigo-600 transition-colors">
                                            {page.title}
                                        </Title>

                                        <Text className="text-slate-500 leading-relaxed mb-6 block">
                                            {page.description}
                                        </Text>

                                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-2 text-[var(--color-accent)] font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                            Truy cập ngay <ArrowRightOutlined />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Footer Section */}
                <div className="mt-20 text-center text-slate-400 text-sm">
                    © 2026 Examination System • Developed by <span className="font-bold text-slate-600">Gemini AI</span>
                </div>
            </div>
        </div>
    );
}