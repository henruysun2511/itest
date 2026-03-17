"use client";

import { useExamAttemptList, useForceSubmitSelected, useGrantRetake, usePauseStudentAttempt } from "@/queries/useExamAttempt"; // Đường dẫn hook của bạn
import { ExamAttemptStatus } from "@/types/enum";
import { ExamAttempt } from "@/types/object";
import {
    CheckCircleOutlined,
    LogoutOutlined,
    PauseCircleOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    WarningOutlined
} from '@ant-design/icons';
import {
    Badge,
    Card, Col, Row, Space,
    Spin,
    Tag, Tooltip, Typography
} from "antd";

const { Title, Text } = Typography;

interface Props {
    examSessionId: string;
}

export default function MonitoringTab({ examSessionId }: Props) {
    // 1. Gọi hook lấy dữ liệu thực tế
    const { data, isLoading } = useExamAttemptList(examSessionId);
    
    // Các hook xử lý hành động (từ file useExamAttempt.ts bạn đã upload)
    const { mutate: pauseAttempt } = usePauseStudentAttempt();
    const { mutate: forceSubmit } = useForceSubmitSelected();
    const { mutate: grantRetake } = useGrantRetake();

    const attempts = data?.data || [];

    // 2. Tính toán thống kê từ dữ liệu thực
    const stats = {
        total: attempts.length,
        examining: attempts.filter(a => a.status === ExamAttemptStatus.IN_PROGRESS).length,
        violation: attempts.filter(a => a.warningCount > 0).length,
        submitted: attempts.filter(a => a.status === ExamAttemptStatus.COMPLETED).length,
    };

    if (isLoading) return <div className="text-center p-10"><Spin size="large" /></div>;

    return (
        <>
            {/* 1. Thống kê nhanh */}
            <Row gutter={16} className="mb-6">
                {[
                    { label: 'Tổng số', count: stats.total, icon: <TeamOutlined />, color: '#1e293b' },
                    { label: 'Đang thi', count: stats.examining, icon: <ThunderboltOutlined />, color: '#16a34a' },
                    { label: 'Có vi phạm', count: stats.violation, icon: <WarningOutlined />, color: '#dc2626' },
                    { label: 'Đã nộp', count: stats.submitted, icon: <CheckCircleOutlined />, color: '#2563eb' },
                ].map((stat, i) => (
                    <Col span={6} key={i}>
                        <Card bordered={false} className="shadow-sm rounded-xl">
                            <Space align="center">
                                <div className="p-3 rounded-lg" style={{ background: stat.color + '10', color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <Text type="secondary">{stat.label}</Text>
                                    <Title level={3} className="!m-0">{stat.count}</Title>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* 2. Danh sách vi phạm (Lọc các thí sinh có warningCount > 0) */}
            <Title level={5} className="mb-4 text-red-600">Thí sinh cần chú ý</Title>
            <Row gutter={[16, 16]} className="mb-8">
                {attempts.filter(a => a.warningCount > 0).map(student => (
                    <StudentCard 
                        key={student.examAttemptId} 
                        student={student} 
                        isWarning 
                        actions={{ pauseAttempt, forceSubmit, grantRetake, examSessionId }}
                    />
                ))}
            </Row>

            {/* 3. Monitoring Grid */}
            <Title level={5} className="mb-4">Tất cả thí sinh trực tuyến</Title>
            <Row gutter={[16, 16]}>
                {attempts.map((student) => (
                    <StudentCard 
                        key={student.examAttemptId} 
                        student={student} 
                        actions={{ pauseAttempt, forceSubmit, grantRetake, examSessionId }}
                    />
                ))}
            </Row>
        </>
    );
}

// Component con để render Card Thí sinh
function StudentCard({ student, isWarning, actions }: { student: ExamAttempt, isWarning?: boolean, actions: any }) {
    const isVio = student.warningCount > 3 || student.fraudLevel === 'HIGH';

    return (
        <Col xs={24} sm={12} md={8} lg={6}>
            <Card
                hoverable
                className={`rounded-xl border-2 transition-all duration-300 ${
                    isWarning ? 'border-red-500 bg-red-50' : 'border-transparent'
                }`}
                bodyStyle={{ padding: 16 }}
                actions={[
                    <Tooltip title="Tạm dừng" key="pause">
                        <PauseCircleOutlined onClick={() => actions.pauseAttempt({ 
                            examSessionId: actions.examSessionId, 
                            studentId: student.studentId, 
                            data: { isPaused: true } 
                        })} />
                    </Tooltip>,
                    <Tooltip title="Thu bài cưỡng chế" key="force">
                        <LogoutOutlined 
                            className="text-red-500" 
                            onClick={() => actions.forceSubmit({
                                examSessionId: actions.examSessionId,
                                data: { studentIds: [student.studentId] }
                            })}
                        />
                    </Tooltip>,
                    <Tooltip title="Cho phép thi lại" key="retake">
                        <ThunderboltOutlined 
                            className="text-amber-500"
                            onClick={() => actions.grantRetake({ 
                                examAttemptId: student.examAttemptId 
                            })}
                        />
                    </Tooltip>,
                ]}
            >
                <div className="flex justify-between items-start mb-3">
                    <Space direction="vertical" size={0}>
                        <Text strong className="text-base truncate block" style={{ maxWidth: 150 }}>
                            {student.fullName}
                        </Text>
                        <Text type="secondary" className="text-xs">{student.studentCode}</Text>
                    </Space>
                    <Badge
                        status={
                            student.status === 'IN_PROGRESS' ? 'processing' :
                            student.status === 'FINISHED' ? 'success' : 'default'
                        }
                    />
                </div>

                <div className="space-y-2 mb-2">
                    <div className="flex justify-between text-xs">
                        <span>IP: {student.ip}</span>
                        <span className="font-bold text-blue-600">{student.status}</span>
                    </div>
                </div>

                {student.warningCount > 0 && (
                    <Tag color="error" icon={<WarningOutlined />} className="w-full text-center m-0">
                        Vi phạm: {student.warningCount} lần
                    </Tag>
                )}

                {student.status === 'FINISHED' && (
                    <Tag color="blue" icon={<CheckCircleOutlined />} className="w-full text-center m-0">
                        Đã nộp bài
                    </Tag>
                )}
            </Card>
        </Col>
    );
}