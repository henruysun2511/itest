"use client";

import { useExamAttemptList, useForceSubmitSelected, useGrantRetake, usePauseStudentAttempt, useSaveAnswers } from "@/queries/useExamAttemptQuery";
import { useFraudDetailList } from "@/queries/useFraudDetailQuery"; // Thêm hook này
import { SortOrder } from "@/shares/constants/sort.enum";
import { ExamAttemptStatus } from "@/shares/constants/status.enum";
import { getFraudTypeBadge } from "@/shares/utils/mappingLabel";
import {
    CheckCircleOutlined,
    HistoryOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    WarningOutlined
} from '@ant-design/icons';
import {
    Badge,
    Card, Col,
    Empty,
    Row, Space,
    Spin,
    Tag,
    Timeline,
    Typography
} from "antd";
import dayjs from "dayjs";
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

    // 1. Lấy dữ liệu attempts (bên trái)
    const { data, isLoading } = useExamAttemptList(examSessionId, { limit: 100 });

    // 2. Lấy 10 vi phạm mới nhất (bên phải)
    const { data: fraudData, isLoading: isFraudLoading } = useFraudDetailList({
        examSessionId,
        page: 1,
        limit: 10,
        sortOrder: SortOrder.DESC
    });

    const { mutate: pauseAttempt } = usePauseStudentAttempt();
    const { mutate: forceSubmit } = useForceSubmitSelected();
    const { mutate: grantRetake } = useGrantRetake();
    const { mutate: saveAnswers } = useSaveAnswers();

    const attempts = data?.data || [];
    const recentFrauds = fraudData?.data || [];

    const stats = {
        total: attempts.length,
        examining: attempts.filter(a => a.status === ExamAttemptStatus.IN_PROGRESS).length,
        violation: attempts.filter(a => a.warningCount > 0).length,
        submitted: attempts.filter(a => a.status === ExamAttemptStatus.COMPLETED).length,
    };

    if (isLoading) return <div className="text-center p-10"><Spin size="large" /></div>;

    return (
        <>
            <Row gutter={16} className="mb-6">
                {[
                    { label: 'Tổng số', count: stats.total, icon: <TeamOutlined />, color: '#1e293b' },
                    { label: 'Đang thi', count: stats.examining, icon: <ThunderboltOutlined />, color: '#16a34a' },
                    { label: 'Có vi phạm', count: stats.violation, icon: <WarningOutlined />, color: '#dc2626' },
                    { label: 'Đã nộp', count: stats.submitted, icon: <CheckCircleOutlined />, color: '#2563eb' },
                ].map((stat, i) => (
                    <Col span={6} key={i}>
                        <Card bordered={false} className="shadow-sm rounded-xl" size="small">
                            <Space align="center">
                                <div className="p-2 rounded-lg" style={{ background: stat.color + '10', color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div className="text-[12px] text-slate-400 leading-tight">{stat.label}</div>
                                    <Title level={4} className="!m-0">{stat.count}</Title>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Thí sinh cần chú ý */}
            {attempts.some(a => a.warningCount > 0) && (
                <>
                    <Title level={5} className="mb-4 text-red-600 flex items-center gap-2">
                        <WarningOutlined /> Thí sinh cần chú ý
                    </Title>
                    <Row gutter={[12, 12]} className="mb-8">
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
                </>
            )}

            {/* Grid tất cả thí sinh */}
            <Title level={5} className="mb-4">Tất cả thí sinh trực tuyến</Title>
            <Row gutter={[12, 12]}>
                {attempts.map((student) => (
                    <>
                        <StudentCard
                            key={student.examAttemptId}
                            student={student}
                            actions={{ pauseAttempt, forceSubmit, grantRetake, saveAnswers, examSessionId }}
                            onHandleViolation={(data) => setHandleModal({ open: true, student: data })}
                        />
                    </>
                ))}
            </Row>

            <div
                className="fixed right-3 top-[180px] w-[270px] bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col z-10"
                style={{ height: 'calc(100vh - 220px)' }}
            >
                <div className="p-4 border-b flex items-center justify-between bg-slate-50 rounded-t-2xl">
                    <Space className="font-bold text-slate-700">
                        <HistoryOutlined className="text-red-500" />
                        <span>Vi phạm mới nhất</span>
                    </Space>
                    <Badge count={recentFrauds.length} color="#ff4d4f" size="small" />
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {isFraudLoading ? (
                        <div className="text-center py-10"><Spin size="small" /></div>
                    ) : recentFrauds.length > 0 ? (
                        <Timeline
                            mode="left"
                            items={recentFrauds.map((fraud: any) => {
                                const badge = getFraudTypeBadge(fraud.fraudType);
                                return {
                                    color: badge.color,
                                    children: (
                                        <div className="mb-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                                            <div className="flex justify-between items-start mb-1">
                                                <Text strong className="text-[12px] block truncate w-[100px]">
                                                    {fraud.fullName}
                                                </Text>
                                                <Text className="text-[10px] text-slate-400">
                                                    {dayjs(fraud.occurredAt).format('HH:mm:ss')}
                                                </Text>
                                            </div>
                                            <Tag
                                                color={badge.color}
                                                className="text-[9px] m-0 leading-tight px-1 py-0 rounded"
                                                style={{ backgroundColor: badge.bgColor, color: badge.color, border: 'none' }}
                                            >
                                                {badge.label}
                                            </Tag>
                                            <div className="text-[10px] text-slate-400 mt-1 font-mono">
                                                {fraud.studentCode}
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        />
                    ) : (
                        <Empty description="Không có vi phạm" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                </div>
            </div>


            <ExamSessionHandlingModal
                open={handleModal.open}
                student={handleModal.student}
                onCancel={() => setHandleModal({ open: false, student: null })}
            />
        </>


    );
}