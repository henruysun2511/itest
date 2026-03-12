import { useExamByExamSet, useGetExamPdf } from "@/queries/useExamQuery";
import { FilePdfOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, message, Table, Tooltip, Typography } from "antd";
import { useState } from "react";

const { Text } = Typography;

export function ExamExpandedTable({ examSetId }: { examSetId: string }) {
    // 1. Fetch dữ liệu với examSetId chính xác
    const { data, isLoading } = useExamByExamSet(examSetId, { 
        page: 1, 
        limit: 100, 
        examSetId 
    });
    const exams = data?.data || [];

    const { mutate: getPdf } = useGetExamPdf();
    
    // 2. Quản lý trạng thái loading riêng cho từng dòng để tránh hiện loading tất cả nút
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleViewPdf = (examId: string) => {
        setLoadingId(examId);
        getPdf(examId, {
            onSuccess: (res) => {
                const pdfUrl = res.data?.data?.pdfUrl;
                if (pdfUrl) {
                    window.open(pdfUrl, "_blank");
                } else {
                    message.warning("Không tìm thấy link PDF cho đề thi này");
                }
                setLoadingId(null);
            },
            onError: () => {
                message.error("Lỗi khi lấy dữ liệu PDF");
                setLoadingId(null);
            }
        });
    };

    const columns = [
        {
            title: "Mã đề",
            dataIndex: "examCode",
            key: "examCode",
            width: 150,
            render: (text: string) => (
                <Text strong className="text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded border border-blue-100">
                    {text}
                </Text>
            )
        },
        { 
            title: "Tiêu đề đề thi", 
            dataIndex: "title", 
            key: "title",
            render: (text: string) => <Text className="text-gray-700">{text}</Text>
        },
        {
            title: "Thao tác",
            key: "action",
            width: 120,
            align: 'right' as const,
            render: (_: any, record: any) => (
                <Tooltip title="Xem chi tiết nội dung PDF">
                    <Button
                        type="primary"
                        size="small"
                        ghost
                        icon={<FilePdfOutlined />}
                        loading={loadingId === record.examId} 
                        onClick={() => handleViewPdf(record.examId)}
                        className="hover:scale-105 transition-transform flex items-center"
                    >
                        Xem PDF
                    </Button>
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="mx-4 mb-4 mt-2 overflow-hidden rounded-xl ">
            {/* Header của bảng lồng */}
            <div className="flex items-center gap-2 bg-gray-50/80 px-4 py-3 border-b border-gray-200">
                <div className="h-5 w-1 bg-blue-500 rounded-full" />
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Danh sách đề thi chi tiết
                </h4>
                <Tooltip title="Các đề thi này thuộc bộ đề đã chọn">
                    <InfoCircleOutlined className="text-gray-400 text-xs cursor-help" />
                </Tooltip>
            </div>

            {/* Table UI */}
            <div className="p-0">
                <Table
                    rowKey="examId"
                    columns={columns}
                    dataSource={exams}
                    loading={isLoading}
                    pagination={false}
                    size="middle"
                    className="custom-nested-table"
                    rowClassName={() => "hover:bg-blue-50/30 transition-colors"}
                    locale={{ emptyText: <Text className="py-8 block text-gray-400">Chưa có đề thi nào trong bộ đề này</Text> }}
                />
            </div>

            <style jsx global>{`
                .custom-nested-table .ant-table-thead > tr > th {
                    background: transparent !important;
                    font-size: 12px;
                    color: #9ca3af !important;
                    text-transform: uppercase;
                    border-bottom: 1px solid #f3f4f6;
                }
                .custom-nested-table .ant-table-cell {
                    border-bottom: 1px solid #f3f4f6 !important;
                }
            `}</style>
        </div>
    );
}