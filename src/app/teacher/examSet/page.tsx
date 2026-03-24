"use client";

import { useExamSetList } from "@/queries/useExamSetQuery";
import { FolderOpenOutlined, SearchOutlined } from "@ant-design/icons";
import { Card, Col, Input, Row, Table, Tag, Typography } from "antd";
import { useState } from "react";

const { Title, Text } = Typography;

export default function ExamSetListPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    // Fetch data using the existing hook
    // Tham số truyền vào chủ yếu là Pagination, có thể kèm theo search
    const { data, isLoading } = useExamSetList({ page, limit, ...(search ? { search } : {}) });

    const columns = [
        {
            title: "Tên bộ đề",
            dataIndex: "name",
            key: "name",
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: "Môn học",
            dataIndex: ["course", "name"],
            key: "courseName",
            render: (text: string) => text ? <Tag color="blue" className="font-semibold">{text}</Tag> : <Text type="secondary">-</Text>
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                const normalizedStatus = status?.toUpperCase();
                if (normalizedStatus === "APPROVED") {
                    return <Tag color="success" className="font-bold border-green-300">Đã duyệt</Tag>;
                } else if (normalizedStatus === "PENDING") {
                    return <Tag color="warning" className="font-bold border-orange-300 text-orange-600">Chờ duyệt</Tag>;
                } else if (normalizedStatus === "REJECTED") {
                    return <Tag color="error" className="font-bold border-red-300">Từ chối</Tag>;
                }
                return <Tag color="default" className="font-semibold">{status || "Không có"}</Tag>;
            }
        }
    ];

    return (
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-[calc(100vh-80px)] bg-[var(--color-bg-base)] rounded-3xl m-4 border border-slate-200 shadow-sm">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <Title level={2} className="!mb-2 !text-[var(--color-navy-deep)] flex items-center gap-3">
                        <FolderOpenOutlined className="text-3xl text-[var(--color-accent)]" /> 
                        Danh sách bộ đề
                    </Title>
                    <Text className="text-slate-500 text-base">
                        Hiển thị danh sách các bộ đề thi đã được tạo trong hệ thống.
                    </Text>
                </div>
            </div>

            <Card className="rounded-2xl border border-slate-200 shadow-sm mb-6" bodyStyle={{ padding: 24 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Input
                            placeholder="Tìm kiếm theo tên bộ đề..."
                            prefix={<SearchOutlined className="text-slate-400" />}
                            size="large"
                            className="rounded-xl border-slate-300 bg-slate-50 hover:bg-white focus:bg-white transition-colors"
                            onPressEnter={(e) => {
                                setSearch((e.target as HTMLInputElement).value);
                                setPage(1);
                            }}
                            onBlur={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            onChange={(e) => {
                                if (e.target.value === "") {
                                    setSearch("");
                                    setPage(1);
                                }
                            }}
                        />
                    </Col>
                </Row>
            </Card>

            <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden" bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={data?.data || []}
                    rowKey="examSetId"
                    loading={isLoading}
                    pagination={{ 
                        current: page,
                        pageSize: limit,
                        total: data?.meta?.total || 0,
                        onChange: (newPage, newPageSize) => {
                            setPage(newPage);
                            setLimit(newPageSize);
                        },
                        className: "p-4 mx-4 mb-0" 
                    }}
                    className="custom-table"
                />
            </Card>
        </div>
    );
}
