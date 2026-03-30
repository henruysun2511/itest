import { useApproveExam, useGetExamPdf } from "@/queries/useExamQuery";
import { ExamStatus } from "@/shares/constants/status.enum";
import { getExamStatusBadge } from "@/shares/utils/mappingLabel";
import { CheckCircleOutlined, CloseCircleOutlined, FilePdfOutlined } from "@ant-design/icons";
import { Badge, Button, Space, Table, message } from "antd";
import { useState } from "react";

export default function ExamTable({ data, loading, pagination }: any) {

    const { mutate: getPdf, isPending } = useGetExamPdf();
    const { mutate: approveExam } = useApproveExam();
    const [actionId, setActionId] = useState<string | null>(null);

    const handleApprove = (examId: string, status: ExamStatus) => {
        setActionId(examId);
        approveExam(
            { id: examId, status },
            {
                onSuccess: () => {
                    message.success("Cập nhật trạng thái đề thi thành công");
                    setActionId(null);
                },
                onError: () => {
                    message.error("Có lỗi xảy ra, vui lòng thử lại");
                    setActionId(null);
                }
            }
        );
    };

    const handleViewPdf = (examId: string) => {
        getPdf(examId, {
            onSuccess: (res) => {
                const pdfUrl = res.data?.data?.pdfUrl;

                if (pdfUrl) {
                    window.open(pdfUrl, "_blank");
                } else {
                    message.warning("Không tìm thấy link PDF cho đề thi này");
                }
            },
            onError: () => {
                message.error("Lỗi khi lấy dữ liệu PDF");
            }
        });
    };

    const columns = [
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 150,
            render: (status: string) => {
                const badge = getExamStatusBadge(status);
                return <Badge status={badge.status as any} text={badge.label} style={{ color: badge.color }} />;
            }
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: any) => {
                // record.status có thể rỗng hoặc PENDING, nhưng chỉ không hiện các nút nếu nó đã duyệt hoặc từ chối.
                const isPendingMode = !record.status || record.status === ExamStatus.PENDING;

                return (
                    <Space size="middle">
                        <Button
                            type="default"
                            icon={<FilePdfOutlined />}
                            onClick={() => handleViewPdf(record.examId)}
                        >
                            Xem đề PDF
                        </Button>
                        {isPendingMode && (
                            <Button
                                type="primary"
                                className="bg-green-600 hover:bg-green-500"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleApprove(record.examId, ExamStatus.ACCEPTED)}
                                loading={actionId === record.examId}
                            >
                                Duyệt
                            </Button>
                        )}
                        {isPendingMode && (
                            <Button
                                danger
                                type="primary"
                                icon={<CloseCircleOutlined />}
                                onClick={() => handleApprove(record.examId, ExamStatus.REJECTED)}
                                loading={actionId === record.examId}
                            >
                                Từ chối
                            </Button>
                        )}
                    </Space>
                );
            },
        },
    ];

    return (
        <Table
            rowKey="examId"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination}
        />
    );
}