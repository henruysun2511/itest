"use client";

import { useMyResultGradings } from "@/queries/useResultGradingQuery";
import { getResultGradingRoleBadge, getResultGradingStatusBadge, RESULT_GRADING_STATUS_OPTIONS } from "@/shares/utils/mappingLabel";
import { ResultGradingStatus } from "@/shares/constants/status.enum";
import { AuditOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Select, Table, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text } = Typography;

export default function ResultGradingListPage() {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [sessionFilter, setSessionFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Fetch API: Dữ liệu trả về có cấu trúc { data: [...], meta: {...} }
    const { data, isLoading } = useMyResultGradings();

    // Lọc dữ liệu client-side (vì API /result-gradings/me không nhận parameters)
    const filteredData = (data?.data || []).filter((item: any) => {
        const matchSearch =
            item.studentFullName?.toLowerCase().includes(search.toLowerCase()) ||
            item.studentCode?.toLowerCase().includes(search.toLowerCase());
        const matchSession = sessionFilter === "all" || item.examSessionCode === sessionFilter;

        const matchStatus = statusFilter === "all" || item.status === statusFilter;
        return matchSearch && matchSession && matchStatus;
    });

    // Lấy danh sách ca thi duy nhất để hiển thị vào bộ lọc
    const uniqueSessions = Array.from(new Set((data?.data || []).map((i: any) => i.examSessionCode))).filter(Boolean);
    const sessionOptions = [
        { label: "Tất cả ca thi", value: "all" },
        ...uniqueSessions.map(sec => ({ label: sec, value: sec }))
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
            dataIndex: "studentFullName",
            key: "studentFullName",
        },
        {
            title: "Ca thi",
            dataIndex: "examSessionCode",
            key: "examSessionCode",
            render: (text: string) => <Tag color="blue" className="font-semibold">{text}</Tag>
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
            render: (role: string) => {
                const badge = getResultGradingRoleBadge(role);
                return <Tag color={badge.color} className="font-semibold">{badge.label}</Tag>;
            }
        },
        {
            title: "Trạng thái",
            key: "status",
            dataIndex: "status",
            render: (status: string) => {
                const badge = getResultGradingStatusBadge(status);
                return (
                    <Tag color={badge.color} className="font-bold border-none px-3 rounded-md">
                        {badge.label}
                    </Tag>
                );
            }
        },
        {
            title: "Điểm",
            dataIndex: "totalScore",
            key: "totalScore",
            render: (score: number | null) => score !== null ? <Text strong className="text-xl text-blue-600">{Number(score).toFixed(1)}</Text> : <Text type="secondary">-</Text>
        },
        {
            title: "Hành động",
            key: "action",
            align: "center" as const,
            render: (_: any, record: any) => {
                const isDone = record.status === ResultGradingStatus.COMPLETED;
                return (
                    <Button
                        type="primary"
                        icon={isDone ? <EyeOutlined /> : <AuditOutlined />}
                        onClick={() => router.push(`/teacher/essayGrading/${record.resultId}`)}
                        disabled={isDone}
                        className={!isDone ? "bg-[var(--color-navy-main)] shadow-md border-none" : "bg-slate-100 border-slate-200 text-slate-400"}
                    >
                        {isDone ? "Đã hoàn thành" : "Chấm bài ngay"}
                    </Button>
                );
            },
        },
    ];

    return (
        <>
            <div className="min-h-screen bg-[#F0F2F5]">
                {/* Hero Header Section */}
                <div className="bg-gradient-to-r from-[var(--color-navy-deep)] to-[var(--color-navy-main)] mb-5 h-48 px-15 pt-10">
                    <div className="max-w-7xl mx-auto flex justify-between items-start">
                        <div>
                            <Title level={2} className="!text-white !m-0">
                                Chấm thi tự luận
                            </Title>
                            <Text className="text-blue-200 opacity-70">
                                Chào buổi sáng, bạn đang quản lý {filteredData?.length || 0} bài thi.
                            </Text>
                        </div>

                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-20 relative z-10 w-full flex flex-col gap-6">
                    <Card className="rounded-2xl shadow-sm border-0" bodyStyle={{ padding: 24 }}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8}>
                                <Input
                                    placeholder="Tìm kiếm theo tên hoặc mã SV..."
                                    prefix={<SearchOutlined className="text-slate-400" />}
                                    size="large"
                                    className="rounded-xl border-slate-300 bg-slate-50 hover:bg-white focus:bg-white transition-colors"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Col>
                            <Col xs={24} md={8}>
                                <Select
                                    placeholder="Lọc theo Ca thi"
                                    size="large"
                                    className="w-full"
                                    value={sessionFilter}
                                    onChange={setSessionFilter}
                                    options={sessionOptions}
                                />
                            </Col>
                            <Col xs={24} md={8}>
                                <Select
                                    placeholder="Lọc theo Trạng thái"
                                    size="large"
                                    className="w-full"
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={RESULT_GRADING_STATUS_OPTIONS}
                                />
                            </Col>
                        </Row>
                    </Card>

                    <Card className="rounded-2xl shadow-sm border-0 overflow-hidden" bodyStyle={{ padding: 0 }}>
                        <Table
                            columns={columns}
                            dataSource={filteredData}
                            rowKey="resultGradingId"
                            loading={isLoading}
                            pagination={{ pageSize: 10, className: "p-4 mx-4 mb-0" }}
                            className="custom-table"
                        />
                    </Card>
                </div>
            </div>

        </>
    );


}
