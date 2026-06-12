"use client";

import {
    BankOutlined,
    CameraOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloudUploadOutlined,
    ScanOutlined,
    SafetyCertificateOutlined,
    SyncOutlined,
    ThunderboltOutlined,
    UserSwitchOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

const features = [
    {
        icon: <ScanOutlined className="text-4xl text-[var(--color-accent)]" />,
        title: "Xác thực danh tính thông minh",
        description: "Đảm bảo đúng người tham gia kỳ thi thông qua công nghệ nhận diện khuôn mặt trước và trong suốt quá trình làm bài.",
        tag: "AI Verification"
    },
    {
        icon: <CameraOutlined className="text-4xl text-[var(--color-accent)]" />,
        title: "Giám sát thi trực tuyến",
        description: "Theo dõi liên tục qua camera để phát hiện các tình huống bất thường, góp phần bảo đảm tính công bằng của kỳ thi.",
        tag: "Online Proctoring"
    },
    {
        icon: <UserSwitchOutlined className="text-4xl text-[var(--color-accent)]" />,
        title: "Phát hiện hành vi vi phạm",
        description: "Tự động ghi nhận các hành vi có dấu hiệu gian lận như rời khỏi màn hình thi hoặc thay đổi môi trường làm bài.",
        tag: "Fraud Detection"
    },
    {
        icon: <SyncOutlined className="text-4xl text-[var(--color-accent)]" />,
        title: "Tự động lưu bài làm",
        description: "Bài làm được lưu liên tục trong quá trình thi, giúp hạn chế tối đa nguy cơ mất dữ liệu khi xảy ra sự cố.",
        tag: "Auto Save"
    },
    {
        icon: <WarningOutlined className="text-4xl text-[var(--color-accent)]" />,
        title: "Cảnh báo theo thời gian thực",
        description: "Mọi sự kiện bất thường đều được thông báo ngay cho giám thị để kịp thời theo dõi và xử lý.",
        tag: "Real-time Alerts"
    },
    {
        icon: <ClockCircleOutlined className="text-4xl text-[var(--color-accent)]" />,
        title: "Quản lý thời gian chính xác",
        description: "Đồng hồ thi tự động đồng bộ và hỗ trợ xử lý các tình huống gián đoạn mà vẫn đảm bảo thời lượng làm bài.",
        tag: "Smart Timer"
    },
    {
        icon: <SafetyCertificateOutlined className="text-4xl text-[var(--color-accent)]" />,
        title: "Theo dõi trạng thái kết nối",
        description: "Hệ thống tự động nhận biết tình trạng trực tuyến của thí sinh và cảnh báo khi có sự cố kết nối.",
        tag: "Connection Monitoring"
    },
    {
        icon: <ThunderboltOutlined className="text-4xl text-[var(--color-accent)]" />,
        title: "Chấm điểm tự động",
        description: "Hỗ trợ chấm điểm nhanh chóng đối với các câu hỏi khách quan và quy trình đánh giá nhiều cấp cho bài tự luận.",
        tag: "Smart Grading"
    },
    {
        icon: <CloudUploadOutlined className="text-4xl text-[var(--color-accent)]" />,
        title: "Nộp bài linh hoạt",
        description: "Cho phép nộp bài theo nhiều hình thức khác nhau, đồng thời hỗ trợ giám thị quản lý và thu bài hiệu quả.",
        tag: "Flexible Submission"
    }
];

const steps = [
    {
        key: '1',
        title: 'Đăng nhập và xem lịch thi',
        desc: 'Sinh viên đăng nhập vào hệ thống để theo dõi các kỳ thi đã đăng ký, thời gian diễn ra và trạng thái của từng ca thi.'
    },
    {
        key: '2',
        title: 'Xác thực và tham gia kỳ thi',
        desc: 'Trước khi bắt đầu, hệ thống xác minh danh tính của thí sinh nhằm đảm bảo tính minh bạch và đúng đối tượng tham gia.'
    },
    {
        key: '3',
        title: 'Làm bài trong môi trường an toàn',
        desc: 'Thí sinh thực hiện bài thi trên giao diện trực quan, đồng thời hệ thống hỗ trợ giám sát và tự động lưu bài làm để hạn chế rủi ro mất dữ liệu.'
    },
    {
        key: '4',
        title: 'Nộp bài và nhận kết quả',
        desc: 'Sau khi hoàn thành, bài thi được nộp tự động hoặc theo yêu cầu của thí sinh. Kết quả được xử lý nhanh chóng và hiển thị đầy đủ trên hệ thống.'
    }
];

export default function ITESTLandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[var(--color-bg-main)] font-['Inter',_system-ui,_sans-serif]">
            <header className="bg-[var(--color-navy-deep)] sticky top-0 z-[100] border-b border-white/10 shadow-sm">
                <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
                        <div className="w-9 h-9 bg-[var(--color-accent)] rounded-lg flex items-center justify-center font-black text-[var(--color-navy-deep)] shadow-lg shadow-orange-500/20">
                            i
                        </div>
                        <span className="text-white font-bold text-xl tracking-tighter">
                            iTEST HVNH
                        </span>
                    </div>

                    <Space size="large" className="hidden md:flex">
                        <Link href="#about" className="text-white/80 hover:text-[var(--color-accent)] font-medium transition-colors">Về ITEST</Link>
                        <Link href="#features" className="text-white/80 hover:text-[var(--color-accent)] font-medium transition-colors">Tính năng</Link>
                        <Link href="#how-it-works" className="text-white/80 hover:text-[var(--color-accent)] font-medium transition-colors">Quy trình</Link>
                    </Space>

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
                            ITEST là nền tảng tổ chức và giám sát thi trực tuyến do Học viện Ngân hàng phát triển. Tích hợp AI nhận diện khuôn mặt đa lớp, giám sát thời gian thực qua MediaPipe FaceMesh, tự động lưu nháp Redis, phát hiện 7 loại vi phạm và SSE real-time — đảm bảo tính toàn vẹn tuyệt đối cho mọi kỳ thi tín chỉ.
                        </Paragraph>
                        <Space className="mt-8" size="middle" wrap>
                            <Button
                                size="large"
                                type="primary"
                                className="bg-[var(--color-accent)] border-none text-[var(--color-navy-deep)] rounded-xl h-12 px-8 font-bold shadow-lg shadow-orange-500/30 hover:!bg-white hover:!text-[var(--color-navy-deep)] transition-all"
                                onClick={() => router.push("/auth/login")}
                            >
                                Đăng nhập thi
                            </Button>
                            <Button
                                size="large"
                                className="bg-white/5 border-2 border-[var(--color-accent)] !text-white rounded-xl h-12 px-8 font-bold hover:!bg-[var(--color-accent)] hover:!text-[var(--color-navy-deep)] transition-all"
                                onClick={() => {
                                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Khám phá tính năng
                            </Button>
                        </Space>
                    </Col>
                    <Col lg={12} className="flex justify-center w-full relative">
                        <div className="relative p-2 bg-white/5 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl w-full max-w-lg">
                            <img
                                src="/bros.png"
                                alt="ITEST AI Proctoring"
                                className="w-full h-auto rounded-2xl"
                            />
                            <div className="absolute top-4 -left-4 bg-[var(--color-navy-deep)] text-white px-4 py-2 rounded-xl font-bold border border-[var(--color-accent)] flex items-center gap-2 shadow-lg text-sm">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse"></span>
                                Xử lý vi phạm realtime
                            </div>
                            <div className="absolute bottom-10 -right-6 bg-white text-[var(--color-success)] px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-xl border border-gray-100 text-sm">
                                <CheckCircleOutlined /> Xác thực khuôn mặt
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-[var(--color-navy-deep)] px-3 py-1 rounded-full font-bold text-[10px] shadow-lg">
                                Sinh đề tự động bằng AI
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

                        <Title
                            level={2}
                            className="!font-bold !text-[var(--color-primary)] mt-4"
                        >
                            Đồng hành cùng chất lượng đào tạo tại Học viện Ngân hàng
                        </Title>

                        <Paragraph className="text-lg text-[var(--color-text-secondary)] leading-relaxed mt-4">
                            Với mục tiêu thúc đẩy chuyển đổi số trong giáo dục,
                            <strong> ITEST </strong>
                            được phát triển như một nền tảng thi trực tuyến hiện đại, hỗ trợ
                            Học viện Ngân hàng tổ chức các kỳ thi một cách thuận tiện, minh
                            bạch và hiệu quả. Hệ thống đáp ứng đầy đủ các nhu cầu đánh giá
                            với 5 dạng câu hỏi phổ biến gồm trắc nghiệm một đáp án, trắc
                            nghiệm nhiều đáp án, đúng/sai, điền khuyết và tự luận.
                        </Paragraph>

                        <Paragraph className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                            ITEST tích hợp các cơ chế giám sát thông minh nhằm đảm bảo tính
                            công bằng trong quá trình thi. Thí sinh được xác thực danh tính
                            trước khi tham gia bài thi và được theo dõi xuyên suốt thời gian
                            làm bài để phát hiện các hành vi bất thường. Hệ thống tự động
                            lưu bài làm định kỳ, hỗ trợ cập nhật trạng thái theo thời gian
                            thực giữa thí sinh và giám thị, đồng thời cung cấp quy trình
                            chấm bài tự luận nhiều cấp nhằm nâng cao độ chính xác và tính
                            khách quan của kết quả đánh giá.
                        </Paragraph>

                        <Row gutter={[16, 16]} className="mt-8">
                            <Col span={8}>
                                <div className="border-l-4 border-[var(--color-accent)] pl-4">
                                    <Title
                                        level={3}
                                        className="!m-0 !text-[var(--color-navy-main)]"
                                    >
                                        7+
                                    </Title>
                                    <Text className="text-[var(--color-text-secondary)]">
                                        Hành vi được giám sát
                                    </Text>
                                </div>
                            </Col>

                            <Col span={8}>
                                <div className="border-l-4 border-[var(--color-accent)] pl-4">
                                    <Title
                                        level={3}
                                        className="!m-0 !text-[var(--color-navy-main)]"
                                    >
                                        5
                                    </Title>
                                    <Text className="text-[var(--color-text-secondary)]">
                                        Dạng câu hỏi
                                    </Text>
                                </div>
                            </Col>

                            <Col span={8}>
                                <div className="border-l-4 border-[var(--color-accent)] pl-4">
                                    <Title
                                        level={3}
                                        className="!m-0 !text-[var(--color-navy-main)]"
                                    >
                                        24/7
                                    </Title>
                                    <Text className="text-[var(--color-text-secondary)]">
                                        Tự động lưu bài làm
                                    </Text>
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
                            Giải pháp giám sát thi trực tuyến toàn diện
                        </Title>
                        <Paragraph className="text-[var(--color-text-secondary)] text-lg mt-4">
                            Tích hợp 9 công nghệ lõi hoạt động đồng thời trong suốt quá trình làm bài thi, đảm bảo tính toàn vẹn và minh bạch tuyệt đối.
                        </Paragraph>
                    </div>

                    <Row gutter={[24, 24]}>
                        {features.map((item, index) => (
                            <Col xs={24} sm={12} lg={8} key={index}>
                                <Card
                                    hoverable
                                    className="h-full rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                                    styles={{ body: { padding: '28px' } }}
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-[var(--color-navy-deep)] w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <Tag color="orange" className="!text-[11px] !font-bold !px-2 !py-0.5 !rounded-full !border-0">
                                                {item.tag}
                                            </Tag>
                                            <Title level={4} className="!text-[var(--color-primary)] !font-semibold !mt-2 !mb-0">
                                                {item.title}
                                            </Title>
                                        </div>
                                    </div>
                                    <Text className="text-[var(--color-text-secondary)] leading-relaxed block">
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
                        <BadgeText text="Quy trình thi" />
                        <Title level={2} className="!font-bold !text-[var(--color-primary)] mt-4">
                            4 bước thí sinh trải nghiệm trên ITEST
                        </Title>
                        <Paragraph className="text-[var(--color-text-secondary)] text-lg mt-4">
                            Quy trình thi được thiết kế khép kín, từ đăng nhập đến nhận kết quả, với sự giám sát liên tục ở mọi giai đoạn.
                        </Paragraph>
                    </div>

                    <Row gutter={[24, 24]} className="relative">
                        <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent)] to-transparent opacity-30 z-0"></div>

                        {steps.map((step) => (
                            <Col xs={24} sm={12} lg={6} key={step.key} className="relative z-10">
                                <Card className="rounded-2xl border border-gray-100 shadow-md h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="bg-[var(--color-accent)] text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-orange-500/20 mb-5">
                                            {step.key}
                                        </div>
                                        <Title level={5} className="!m-0 !font-bold !text-[var(--color-navy-deep)] mb-3">
                                            {step.title}
                                        </Title>
                                        <Text className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                                            {step.desc}
                                        </Text>
                                    </div>
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