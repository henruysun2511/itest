"use client";

import {
    BookOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    InfoCircleOutlined,
    LoginOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Badge, Button, Card, Col, Input, Row, Space, Typography } from 'antd';

const { Title, Text } = Typography;

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

    return (
        <div className="min-h-screen bg-[var(--color-bg-main)] p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Profile Section */}
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Title level={2} className="!m-0 !text-[var(--color-navy-deep)]">
                            Danh sách lịch thi
                        </Title>
                        <Text className="text-[var(--color-text-secondary)]">
                            Sinh viên: <span className="font-bold text-[var(--color-navy-main)] text-lg">Nguyễn Văn A</span>
                        </Text>
                    </div>
                    <Input 
                        placeholder="Tìm môn thi..." 
                        prefix={<SearchOutlined className="text-gray-300" />}
                        className="max-w-xs rounded-full shadow-sm h-10"
                    />
                </div>

                {/* Grid Danh sách Card */}
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
                                                className={`rounded-xl font-bold h-12 flex items-center justify-center transition-all ${
                                                    session.status === 'available' 
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

                {/* Footer Info */}
                <div className="mt-12 p-6 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                    <Text italic className="text-[var(--color-text-secondary)]">
                        * Lưu ý: Thí sinh cần có mặt tại phòng thi trước ít nhất 15 phút để ổn định vị trí.
                    </Text>
                </div>
            </div>
        </div>
    );
}