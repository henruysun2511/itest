"use client";

import {
    BankOutlined,
    CheckCircleOutlined,
    SafetyCertificateOutlined,
    ScanOutlined,
    ThunderboltOutlined,
    UserSwitchOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

// Dữ liệu tính năng AI
const features = [
    {
        icon: <ScanOutlined className="text-4xl text-[var(--color-accent)]" />,
        title: "Nhận diện khuôn mặt AI",
        description: "Xác thực danh tính sinh viên Học viện Ngân hàng chính xác qua đối chiếu dữ liệu thẻ sinh viên trước khi vào phòng thi."
    },
    {
        icon: <SafetyCertificateOutlined className="text-4xl text-[var(--color-accent)]" />,
        title: "Giám sát vi phạm 24/7",
        description: "AI tự động phát hiện quay cóp, rời khỏi khung hình, có người lạ hoặc sử dụng thiết bị phụ trong suốt thời gian làm bài."
    },
    {
        icon: <UserSwitchOutlined className="text-4xl text-[var(--color-accent)]" />,
        title: "Khóa trình duyệt an toàn",
        description: "Ngăn chặn sinh viên mở tab mới, copy/paste tài liệu hay sử dụng phần mềm thứ ba trong quá trình thi ITEST."
    },
    {
        icon: <ThunderboltOutlined className="text-4xl text-[var(--color-accent)]" />,
        title: "Chấm điểm & Báo cáo tự động",
        description: "Hệ thống tự động chấm điểm trắc nghiệm và xuất báo cáo chi tiết về các hành vi cảnh báo gian lận cho giảng viên."
    }
];

// Dữ liệu quy trình
const steps = [
    { key: '1', title: 'Đăng nhập hệ thống', desc: 'Sinh viên sử dụng tài khoản tín chỉ để đăng nhập ITEST.' },
    { key: '2', title: 'Xác thực E-KYC', desc: 'Hệ thống quét khuôn mặt và kiểm tra thẻ sinh viên.' },
    { key: '3', title: 'Làm bài & Giám sát', desc: 'AI giám sát liên tục qua webcam và ghi nhận cảnh báo.' },
    { key: '4', title: 'Hoàn thành thi', desc: 'Nộp bài an toàn, hệ thống lưu trữ toàn bộ log vi phạm.' },
];

export default function ITESTLandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[var(--color-bg-main)] font-['Inter',_system-ui,_sans-serif]">
            {/* --- HEADER ĐỒNG BỘ LAYOUT --- */}
            <header className="bg-[var(--color-navy-deep)] sticky top-0 z-[100] border-b border-white/10 shadow-sm">
                <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo đồng bộ */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
                        <div className="w-9 h-9 bg-[var(--color-accent)] rounded-lg flex items-center justify-center font-black text-[var(--color-navy-deep)] shadow-lg shadow-orange-500/20">
                            i
                        </div>
                        <span className="text-white font-bold text-xl tracking-tighter">
                            iTEST HVNH
                        </span>
                    </div>

                    {/* Menu Links */}
                    <Space size="large" className="hidden md:flex">
                        <Link href="#about" className="text-white/80 hover:text-[var(--color-accent)] font-medium transition-colors">Về ITEST</Link>
                        <Link href="#features" className="text-white/80 hover:text-[var(--color-accent)] font-medium transition-colors">Tính năng AI</Link>
                        <Link href="#how-it-works" className="text-white/80 hover:text-[var(--color-accent)] font-medium transition-colors">Quy trình</Link>
                    </Space>

                    {/* Button Đăng nhập */}
                    <Space>
                        <Button
                            type="primary"
                            className="bg-[var(--color-accent)] border-none text-[var(--color-navy-deep)] rounded-xl h-10 px-6 font-bold shadow-md hover:!bg-white hover:!text-[var(--color-navy-deep)] transition-all"
                            onClick={() => router.push("/auth/login")}
                        >
                            Đăng nhập thi
                        </Button>
                    </Space>
                </nav>
            </header>

            {/* --- HERO SECTION --- */}
            <section className="bg-gradient-to-b from-[var(--color-navy-deep)] to-[var(--color-navy-main)] text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#fff" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center relative z-10 gap-16">
                    <Col lg={12} className="text-center lg:text-left">
                        <BadgeText text="Hệ thống nội bộ - Học viện Ngân hàng" />
                        <Title level={1} className="!text-white !font-extrabold !text-5xl !leading-tight mt-6">
                            Hệ thống thi trực tuyến <br />
                            <span className="text-[var(--color-accent)]">Thông minh & Minh bạch</span>
                        </Title>
                        <Paragraph className="text-blue-100 text-lg opacity-90 mt-6 max-w-2xl mx-auto lg:mx-0">
                            ITEST là nền tảng kiểm tra, đánh giá trực tuyến do Học viện Ngân hàng phát triển. Tích hợp AI nhận diện khuôn mặt và phát hiện gian lận thời gian thực, đảm bảo tính toàn vẹn tuyệt đối cho mọi kỳ thi tín chỉ.
                        </Paragraph>
                    </Col>
                    <Col lg={12} className="flex justify-center w-full relative">
                        <div className="relative p-2 bg-white/5 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl w-full max-w-lg">
                            <img
                                src="/bros.png"
                                alt="ITEST AI Proctoring"
                                className="w-full h-auto rounded-2xl"
                            />
                            <div className="absolute top-4 -left-4 bg-[var(--color-navy-deep)] text-white px-4 py-2 rounded-xl font-bold border border-[var(--color-accent)] flex items-center gap-2 shadow-lg">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse"></span>
                                AI Live Proctoring
                            </div>
                            <div className="absolute bottom-10 -right-6 bg-white text-[var(--color-success)] px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-xl border border-gray-100">
                                <CheckCircleOutlined /> Face ID Verified
                            </div>
                        </div>
                    </Col>
                </div>
            </section>

            {/* --- ABOUT ITEST SECTION --- */}
            <section id="about" className="max-w-7xl mx-auto px-6 py-20">
                <Row gutter={[48, 48]} align="middle">
                    <Col xs={24} lg={12}>
                        <div className="relative rounded-3xl overflow-hidden shadow-xl">
                            <img
                                src="https://cdn-media.sforum.vn/storage/app/media/ngocmy/hoc-phi-hoc-vien-ngan-hang/hoc-phi-hoc-vien-ngan-hang-1.jpg"
                                alt="Học viện Ngân hàng"
                                className="w-full h-[400px] object-cover"
                            />
                            <div className="absolute inset-0 bg-[var(--color-navy-deep)] opacity-40 mix-blend-multiply"></div>
                        </div>
                    </Col>
                    <Col xs={24} lg={12}>
                        <BadgeText text="Về phần mềm ITEST" />
                        <Title level={2} className="!font-bold !text-[var(--color-primary)] mt-4">
                            Đồng hành cùng chất lượng đào tạo tại Học viện Ngân hàng
                        </Title>
                        <Paragraph className="text-lg text-[var(--color-text-secondary)] leading-relaxed mt-4">
                            Với mục tiêu chuyển đổi số toàn diện, <strong>ITEST</strong> ra đời như một giải pháp thiết yếu giúp Học viện Ngân hàng tổ chức các kỳ thi trực tuyến an toàn, tiết kiệm và khách quan.
                        </Paragraph>
                        <Paragraph className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                            Không chỉ là công cụ tạo đề và chấm điểm, ITEST áp dụng công nghệ Trí tuệ nhân tạo (AI) để phân tích hành vi, đảm bảo mỗi bài thi đều phản ánh đúng năng lực thực chất của sinh viên, giữ vững uy tín học thuật của nhà trường.
                        </Paragraph>

                        <Row gutter={[16, 16]} className="mt-8">
                            <Col span={12}>
                                <div className="border-l-4 border-[var(--color-accent)] pl-4">
                                    <Title level={3} className="!m-0 !text-[var(--color-navy-main)]">100%</Title>
                                    <Text className="text-[var(--color-text-secondary)]">Bảo mật đề thi</Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="border-l-4 border-[var(--color-accent)] pl-4">
                                    <Title level={3} className="!m-0 !text-[var(--color-navy-main)]">20.000+</Title>
                                    <Text className="text-[var(--color-text-secondary)]">Sinh viên sử dụng</Text>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section id="features" className="bg-[var(--color-bg-card)] py-24 border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <BadgeText text="Công nghệ lõi" />
                        <Title level={2} className="!font-bold !text-[var(--color-primary)] mt-4">
                            Giải pháp chống gian lận AI toàn diện
                        </Title>
                    </div>

                    <Row gutter={[32, 32]}>
                        {features.map((item, index) => (
                            <Col xs={24} sm={12} lg={6} key={index}>
                                <Card
                                    hoverable
                                    className="h-full rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                                    bodyStyle={{ padding: '32px' }}
                                >
                                    <div className="bg-[var(--color-navy-deep)] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                        {item.icon}
                                    </div>
                                    <Title level={4} className="!text-[var(--color-primary)] !font-semibold mb-3">
                                        {item.title}
                                    </Title>
                                    <Text className="text-[var(--color-text-secondary)] leading-relaxed">
                                        {item.description}
                                    </Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* --- HOW IT WORKS --- */}
            <section id="how-it-works" className="py-24 px-6 bg-[var(--color-bg-main)]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <BadgeText text="Hướng dẫn thi" />
                        <Title level={2} className="!font-bold !text-[var(--color-primary)] mt-4">
                            4 bước để hoàn thành bài thi trên ITEST
                        </Title>
                    </div>

                    <Row gutter={[24, 24]} className="relative">
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--color-accent)] opacity-20 -translate-y-1/2 z-0"></div>

                        {steps.map((step, index) => (
                            <Col xs={24} sm={12} lg={6} key={step.key} className="relative z-10">
                                <Card className="rounded-2xl border-none shadow-md h-full hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-[var(--color-accent)] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                                            {step.key}
                                        </div>
                                        <Title level={5} className="!m-0 !font-semibold !text-[var(--color-navy-deep)] leading-tight">
                                            {step.title}
                                        </Title>
                                    </div>
                                    <Text className="text-[var(--color-text-secondary)]">
                                        {step.desc}
                                    </Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-[var(--color-navy-deep)] text-gray-300 py-12 px-6 border-t-[6px] border-[var(--color-accent)]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <BankOutlined className="text-4xl text-[var(--color-accent)]" />
                        <div>
                            <Title level={4} className="!m-0 !text-white !font-bold">
                                Học viện Ngân hàng
                            </Title>
                            <Text className="text-gray-400">Hệ thống thi trực tuyến ITEST</Text>
                        </div>
                    </div>

                    <Space size="large" className="text-sm font-medium">
                        <Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Hỗ trợ kỹ thuật</Link>
                        <Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Hướng dẫn sử dụng</Link>
                        <Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Quy chế thi</Link>
                    </Space>
                </div>
                <div className="max-w-7xl mx-auto text-center text-gray-500 mt-8 pt-6 border-t border-gray-700/50 text-sm">
                    &copy; {new Date().getFullYear()} Học viện Ngân hàng. Phát triển và vận hành bởi Trung tâm CNTT.
                </div>
            </footer>
        </div>
    );
}

// Component phụ cho Label text
const BadgeText = ({ text }: { text: string }) => (
    <span className="inline-block bg-[var(--color-accent-soft)] text-[var(--color-navy-deep)] px-4 py-1.5 rounded-full font-bold text-sm tracking-wide shadow-sm">
        {text}
    </span>
);