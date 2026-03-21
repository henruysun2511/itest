"use client";

import { EyeOutlined, SearchOutlined, AuditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Select, Space, Table, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text } = Typography;

export default function ResultGradingListPage() {
    const router = useRouter();

    // Mock data
    const mockData = [
        {
            id: "rg-1",
            resultId: "res-1",
            studentName: "Nguyễn Văn A",
            studentCode: "26A4041675",
            examSessionCode: "EXAM-2023-01",
            role: "GRADER_1",
            isPublished: false,
            score: null,
            submittedAt: "2023-11-01T10:30:00Z"
        },
        {
            id: "rg-2",
            resultId: "res-2",
            studentName: "Trần Thị B",
            studentCode: "26A4041676",
            examSessionCode: "EXAM-2023-01",
            role: "REVIEWER",
            isPublished: true,
            score: 8.5,
            submittedAt: "2023-11-01T11:00:00Z"
        }
    ];

    const columns = [
        {
            title: "Mã Sinh Viên",
            dataIndex: "studentCode",
            key: "studentCode",
            width: 150,
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: "Họ và Tên",
            dataIndex: "studentName",
            key: "studentName",
        },
        {
            title: "Ca thi",
            dataIndex: "examSessionCode",
            key: "examSessionCode",
            render: (text: string) => <Tag color="blue" className="font-semibold">{text}</Tag>
        },
        {
            title: "Vai trò chấm",
            dataIndex: "role",
            key: "role",
            render: (role: string) => {
                const colors: Record<string, string> = {
                    GRADER_1: "magenta",
                    GRADER_2: "purple",
                    REVIEWER: "cyan",
                    FINAL_APPROVER: "gold",
                };
                return <Tag color={colors[role] || "default"} className="font-semibold">{role}</Tag>;
            }
        },
        {
            title: "Trạng thái",
            key: "status",
            render: (_: any, record: any) => {
                return record.isPublished ? (
                    <Tag color="success" className="font-bold border-green-300">Đã hoàn thành</Tag>
                ) : (
                    <Tag color="warning" className="font-bold border-orange-300 text-orange-600">Chưa chấm</Tag>
                );
            }
        },
        {
            title: "Điểm",
            dataIndex: "score",
            key: "score",
            render: (score: number | null) => score !== null ? <Text strong className="text-xl text-blue-600">{score.toFixed(1)}</Text> : <Text type="secondary">-</Text>
        },
        {
            title: "Hành động",
            key: "action",
            align: "center" as const,
            render: (_: any, record: any) => (
                <Button
                    type="primary"
                    icon={record.isPublished ? <EyeOutlined /> : <AuditOutlined />}
                    onClick={() => router.push(`/teacher/result-grading/${record.id}`)}
                    ghost={record.isPublished}
                    className={!record.isPublished ? "bg-[var(--color-navy-main)] shadow-md" : ""}
                >
                    {record.isPublished ? "Xem bài & Điểm" : "Chấm bài ngay"}
                </Button>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-[calc(100vh-80px)] bg-[var(--color-bg-base)] rounded-3xl m-4 border border-slate-200 shadow-sm">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <Title level={2} className="!mb-2 !text-[var(--color-navy-deep)] flex items-center gap-3">
                        <AuditOutlined className="text-3xl text-[var(--color-accent)]" /> 
                        Chấm thi tự luận
                    </Title>
                    <Text className="text-slate-500 text-base">
                        Danh sách các bài làm được hệ thống phân công cho bạn chấm thi.
                    </Text>
                </div>
            </div>

            <Card className="rounded-2xl border border-slate-200 shadow-sm mb-6" bodyStyle={{ padding: 24 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Input
                            placeholder="Tìm kiếm theo tên hoặc mã SV..."
                            prefix={<SearchOutlined className="text-slate-400" />}
                            size="large"
                            className="rounded-xl border-slate-300 bg-slate-50 hover:bg-white focus:bg-white transition-colors"
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <Select
                            placeholder="Lọc theo Ca thi"
                            size="large"
                            className="w-full"
                            options={[
                                { label: "Tất cả ca thi", value: "all" },
                                { label: "EXAM-2023-01", value: "EXAM-2023-01" },
                            ]}
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <Select
                            placeholder="Lọc theo Trạng thái"
                            size="large"
                            className="w-full"
                            options={[
                                { label: "Tất cả trạng thái", value: "all" },
                                { label: "Chưa chấm", value: "pending" },
                                { label: "Đã hoàn thành", value: "done" },
                            ]}
                        />
                    </Col>
                </Row>
            </Card>

            <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden" bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={mockData}
                    rowKey="id"
                    pagination={{ pageSize: 10, className: "p-4 mx-4 mb-0" }}
                    className="custom-table"
                />
            </Card>
        </div>
    );
}
