import { useMyResultList } from "@/queries/useResultQuery";
import { getResultStatusBadge } from "@/shares/utils/mappingLabel";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Card, Table, Tag, Tooltip } from "antd";
import { useRouter } from "next/navigation";

export function ExamResultTab() {
    const router = useRouter();
    // Lấy danh sách kết quả của tôi (giả định dùng limit lớn hoặc có phân trang)
    const { data, isLoading } = useMyResultList({ page: 1, limit: 100 });
    console.log(data)

    const columns = [
        {
            title: "Mã phiên thi",
            dataIndex: "examSessionCode",
            key: "examSessionCode",
            render: (text: string) => <span className="font-bold text-slate-700">{text}</span>
        },
        {
            title: "Ngày thi",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
        },
        {
            title: "Điểm số",
            dataIndex: "scoreDetail",
            key: "totalScore",
            align: "center" as const,
            render: (scoreDetail?: any) => {
                if (!scoreDetail || scoreDetail.maxScore === undefined) {
                    return <span className="text-slate-400">-</span>;
                }
                const score = scoreDetail.maxScore;
                const scoreClass = score < 5 ? 'text-red-500' : 'text-green-600';

                return (
                    <span className={`font-bold ${scoreClass}`}>
                        {score}
                    </span>
                );
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center" as const,
            render: (status: string) => {
                const config = getResultStatusBadge(status);
                return <Tag color={config.color}>{config.label}</Tag>;
            }
        },
        {
            title: "Hành động",
            key: "action",
            align: "center" as const,
            render: (_: any, record: any) => (
                <Tooltip title="Xem chi tiết kết quả">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<EyeOutlined />}
                        onClick={() => router.push(`/student/result/${record.resultId}`)}
                        className="bg-blue-50 text-blue-600 border-none hover:bg-blue-600 hover:text-white"
                    />
                </Tooltip>
            )
        }
    ];

    return (
        <Card className="rounded-2xl border-none shadow-sm min-h-[400px]">
            <Table
                columns={columns}
                dataSource={data?.data ?? []}
                loading={isLoading}
                rowKey="resultId"
                pagination={{ pageSize: 5 }}
                className="custom-table"
            />
        </Card>
    );
}