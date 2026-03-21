import { useGetExamPdf } from "@/queries/useExamQuery";
import { FilePdfOutlined } from "@ant-design/icons";
import { Button, Table, message } from "antd";

export default function ExamTable({ data, loading, pagination }: any) {
    
    const { mutate: getPdf, isPending } = useGetExamPdf();

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
            title: "Mã đề thi",
            dataIndex: "examCode",
            key: "examCode",
            render: (text: string) => <span className="font-bold text-blue-600">{text}</span>
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: any) => (
                <Button
                    type="default"
                    icon={<FilePdfOutlined />}
                    onClick={() => handleViewPdf(record.examId)}
                >
                    Xem đề PDF
                </Button>
            ),
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