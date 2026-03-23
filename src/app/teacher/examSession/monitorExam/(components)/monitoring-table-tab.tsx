"use client";

import { useToast } from "@/hooks/useToast";
import {
    useExamAttemptList,
    useForceSubmitSelected,
    useGrantRetake,
    usePauseStudentAttempt,
    useSaveAnswers
} from "@/queries/useExamAttemptQuery";
import { ExamAttempt } from "@/shares/types/object";
import { ExamAttemptParam } from "@/shares/types/param";
import { handleError } from "@/shares/utils/error";
import { getStatusBadge } from "@/shares/utils/mappingLabel";
import {
    AlertOutlined,
    CheckCircleOutlined,
    LogoutOutlined,
    PauseCircleOutlined,
    SaveOutlined,
    ThunderboltOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { Button, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import dayjs from "dayjs";
import { useState } from "react";
import ExamSessionHandlingModal from "./examSessionHandling-create-modal";
import MonitoringFilter from "./monitoring-filter";

const { Text } = Typography;

interface Props {
    examSessionId: string;
}

export default function MonitoringTableTab({ examSessionId }: Props) {
    const toast = useToast();
    const [handleModal, setHandleModal] = useState<{ open: boolean, student: any | null }>({
        open: false,
        student: null
    });
    const [params, setParams] = useState<ExamAttemptParam>({
        page: 1,
        limit: 30,
        search: "",
        status: undefined,
        fraudLevel: undefined
    });

    const { data, isLoading } = useExamAttemptList(examSessionId, params);

    // Hooks hành động
    const { mutate: pauseAttempt } = usePauseStudentAttempt();
    const { mutate: forceSubmit } = useForceSubmitSelected();
    const { mutate: grantRetake } = useGrantRetake();
    const { mutate: saveAnswers } = useSaveAnswers();

    const handleAction = (actionFn: any, payload: any, actionName: string) => {
        actionFn(payload, {
            onSuccess: (res: any) => {
                toast.success(res?.data?.message || `${actionName} thành công`);
            },
            onError: (err: any) => handleError(err, toast)
        });
    };

    // Hàm xử lý khi thay đổi phân trang, lọc hoặc sắp xếp trong Table
    const handleTableChange = (pagination: TablePaginationConfig) => {
        setParams(prev => ({
            ...prev,
            page: pagination.current || 1,
            limit: pagination.pageSize || 10,
        }));
    };

    const columns: ColumnsType<ExamAttempt> = [
        {
            title: 'Thí sinh',
            key: 'student',
            fixed: 'left',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.fullName}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.studentCode}</Text>
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const info = getStatusBadge(status);
                return <Tag color={info.color}>{info.label}</Tag>;
            }
        },
        {
            title: 'Vi phạm',
            dataIndex: 'warningCount',
            key: 'warningCount',
            align: 'center',
            render: (count) => count > 0 ? <Tag color="error" icon={<WarningOutlined />}>{count}</Tag> : "0"
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            width: 70,
            key: 'ip',
        },
        {
            title: 'Bắt đầu',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (time) => time ? dayjs(time).format('HH:mm:ss') : '-'
        },
        {
            title: 'Kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (time) => time ? (
                <Text type="success">{dayjs(time).format('HH:mm:ss')}</Text>
            ) : (
                <Text type="secondary" italic>Chưa nộp</Text>
            )
        },
        {
            title: 'Thời gian làm bài còn lại',
            dataIndex: 'consumedTime',
            key: 'consumedTime',
            render: (time) => <Text code>{time}s</Text>
        },
        {
            title: 'Thao tác coi thi',
            key: 'actions',
            fixed: 'right',
            width: 230,
            render: (_, record) => {
                const isPaused = record.status === "PAUSE";
                const isCompleted = record.status === "COMPLETED";
                return (
                    <Space size="small">
                        <Tooltip title={isPaused ? "Tiếp tục" : "Tạm dừng"}>
                            <Button
                                type="text"
                                disabled={isCompleted}
                                icon={isPaused ? <CheckCircleOutlined className={isCompleted ? "" : "text-green-500"} /> : <PauseCircleOutlined />}
                                onClick={() => handleAction(
                                    pauseAttempt,
                                    { examSessionId, studentId: record.studentId, data: { isPaused: !isPaused } },
                                    isPaused ? "Tiếp tục" : "Tạm dừng"
                                )}
                            />
                        </Tooltip>

                        <Tooltip title="Lưu bài làm">
                            <Button
                                type="text"
                                disabled={isCompleted}
                                icon={<SaveOutlined className={isCompleted ? "" : "text-blue-500"} />}
                                onClick={() => handleAction(
                                    saveAnswers,
                                    { examSessionId, data: { studentId: record.studentId, studentCode: record.studentCode } },
                                    "Lưu bài"
                                )}
                            />
                        </Tooltip>

                        <Tooltip title="Thu bài cưỡng chế">
                            <Button
                                type="text"
                                disabled={isCompleted}
                                icon={<LogoutOutlined className={isCompleted ? "" : "text-red-500"} />}
                                onClick={() => handleAction(
                                    forceSubmit,
                                    { examSessionId, data: { studentIds: [record.studentId] } },
                                    "Thu bài"
                                )}
                            />
                        </Tooltip>

                        <Tooltip title="Cho thi lại">
                            <Button
                                type="text"
                                className="text-amber-500"
                                icon={<ThunderboltOutlined />}
                                onClick={() => handleAction(
                                    grantRetake,
                                    { studentId: record.studentId, studentCode: record.studentCode, examSessionId },
                                    "Cấp quyền thi lại"
                                )}
                            />
                        </Tooltip>
                        <Tooltip title="Xử lý vi phạm">
                            <Button
                                type="text"
                                danger
                                className="text-white"
                                icon={<AlertOutlined />}
                                onClick={() => setHandleModal({
                                    open: true,
                                    student: {
                                        studentId: record.studentId,
                                        fullName: record.fullName,
                                        examAttemptId: record.examAttemptId,
                                        examSessionId: examSessionId
                                    }
                                })}
                            />
                        </Tooltip>
                    </Space>
                );
            }
        }
    ];

    return (
        <>
            <MonitoringFilter params={params} setParams={setParams} />
            <Table
                dataSource={data?.data || []}
                columns={columns}
                rowKey="examAttemptId"
                loading={isLoading}
                scroll={{ x: 1000 }}
                onChange={handleTableChange}
                pagination={{
                    current: params.page,
                    pageSize: params.limit,
                    total: data?.meta?.total,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showTotal: (total) => `Tổng cộng ${total} thí sinh`,
                }}
                bordered
                className="rounded-lg overflow-hidden"
            />

            <ExamSessionHandlingModal
                open={handleModal.open}
                student={handleModal.student}
                onCancel={() => setHandleModal({ open: false, student: null })}
            />
        </>
    );
}