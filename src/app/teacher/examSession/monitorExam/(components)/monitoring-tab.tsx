"use client";

import { useExamAttemptList, useForceSubmitSelected, useGrantRetake, usePauseStudentAttempt, useSaveAnswers } from "@/queries/useExamAttemptQuery";
import { ExamAttemptStatus } from "@/types/enum";
import {
    CheckCircleOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    WarningOutlined
} from '@ant-design/icons';
import {
    Card, Col, Row, Space,
    Spin,
    Typography
} from "antd";
import { useState } from "react";
import ExamSessionHandlingModal from "./examSessionHandling-create-modal";
import StudentCard from "./student-card";

const { Title, Text } = Typography;

interface Props {
    examSessionId: string;
}

export default function MonitoringTab({ examSessionId }: Props) {
    const [handleModal, setHandleModal] = useState<{ open: boolean, student: any | null }>({
        open: false,
        student: null
    });

    // 1. Gọi hook lấy dữ liệu thực tế
    const { data, isLoading } = useExamAttemptList(examSessionId, {
        limit: 100
    });
    
    // Các hook xử lý hành động 
    const { mutate: pauseAttempt } = usePauseStudentAttempt();
    const { mutate: forceSubmit } = useForceSubmitSelected();
    const { mutate: grantRetake } = useGrantRetake();
    const { mutate: saveAnswers } = useSaveAnswers();

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
                        actions={{ pauseAttempt, forceSubmit, grantRetake, saveAnswers, examSessionId }}
                        onHandleViolation={(data) => setHandleModal({ open: true, student: data })}
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
                        actions={{ pauseAttempt, forceSubmit, grantRetake, saveAnswers, examSessionId }}
                        onHandleViolation={(data) => setHandleModal({ open: true, student: data })}
                    />
                ))}
            </Row>

            <ExamSessionHandlingModal
                open={handleModal.open}
                student={handleModal.student}
                onCancel={() => setHandleModal({ open: false, student: null })}
            />
        </>
    );
}

