"use client";

import { useExamSetList } from "@/queries/useExamSetQuery";
import { useUploadFileCloudinary } from "@/queries/useCloudinaryQuery";
import { FolderOpenOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Col, Input, Row, Table, Tag, Typography, Tabs, List, Button, Divider, Form } from "antd";
import { useState } from "react";
import EditableExam from "./editors/exam-editor";

// Mock data cho câu hỏi
const mockQuestions = [
  {
    id: 1,
    content: "Câu hỏi 1: 1 + 1 = ?",
    type: "MULTIPLE_CHOICE",
    options: ["1", "2", "3", "4"],
    correctAnswer: "2"
  },
  {
    id: 2,
    content: "Câu hỏi 2: Tự luận về React",
    type: "ESSAY",
    options: [],
    correctAnswer: ""
  },
  // Thêm mock data khác
];

const { Title, Text } = Typography;

export default function ExamSetListPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    // State cho tạo đề thi
    const [examData, setExamData] = useState<any>({
      title: "",
      parts: []
    });
    const [answersState, setAnswersState] = useState<Record<number, { correctAnswer: string[]; points: number }>>({});
    const [hasEssay, setHasEssay] = useState(false);

    const uploadHook = useUploadFileCloudinary();

    // Fetch data using the existing hook
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

    const handleAddQuestion = (question: any) => {
        // Logic add question vào examData
        // Tạm thời add vào part đầu
        const newQuestion = {
            questionIndex: examData.parts[0]?.questions?.length + 1 || 1,
            questionText: question.content,
            questionType: question.type,
            options: question.options?.map((opt: string, index: number) => ({
                label: String.fromCharCode(65 + index), // A, B, C, D
                text: opt
            })),
            mediaPlaceholders: [],
        };
        const updatedParts = [...examData.parts];
        if (updatedParts.length === 0) {
            updatedParts.push({
                partIndex: 1,
                partTitle: "Part 1",
                partDescription: "",
                mediaPlaceholders: [],
                questionGroups: [],
                questions: [newQuestion],
                questionType: "mixed",
            });
        } else {
            updatedParts[0].questions.push(newQuestion);
        }
        setExamData({ ...examData, parts: updatedParts });
    };

    const tabItems = [
        {
            key: "bank",
            label: "Ngân hàng đề thi",
            children: (
                <div>
                    <Card className="mb-4">
                        <Input
                            placeholder="Tìm kiếm bộ đề..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            allowClear
                        />
                    </Card>
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={data?.data || []}
                            loading={isLoading}
                            rowKey="examSetId"
                            pagination={{
                                current: page,
                                pageSize: limit,
                                total: data?.total || 0,
                                onChange: (p, l) => {
                                    setPage(p);
                                    setLimit(l);
                                },
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bộ đề`
                            }}
                        />
                    </Card>
                </div>
            )
        },
        {
            key: "create",
            label: "Tạo đề thi",
            children: (
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="Danh sách câu hỏi" style={{ height: '70vh', overflowY: 'auto' }}>
                            <List
                                dataSource={mockQuestions}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                key="add"
                                                type="primary"
                                                size="small"
                                                onClick={() => handleAddQuestion(item)}
                                            >
                                                Thêm
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={item.content}
                                            description={`Loại: ${item.type}`}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Card title="Tạo đề thi" style={{ height: '70vh', overflowY: 'auto' }}>
                            <Form layout="vertical">
                                <Form.Item label="Tên đề thi">
                                    <Input
                                        value={examData.title}
                                        onChange={(e) => setExamData({ ...examData, title: e.target.value })}
                                        placeholder="Nhập tên đề thi"
                                    />
                                </Form.Item>
                                <EditableExam
                                    value={examData}
                                    onChange={setExamData}
                                    answersState={answersState}
                                    setAnswersState={setAnswersState}
                                    uploadHook={uploadHook}
                                    hasEssay={hasEssay}
                                />
                            </Form>
                        </Card>
                    </Col>
                </Row>
            )
        }
    ];

    return (
        <div className="p-6">
            <Title level={2} className="mb-6">Quản lý bộ đề thi</Title>
            <Tabs defaultActiveKey="bank" items={tabItems} />
        </div>
    );
}
