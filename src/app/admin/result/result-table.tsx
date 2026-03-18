import { Result } from "@/types/object";
import { Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";

interface Props {
    data: Result[];
    loading?: boolean;
    pagination?: any;
    onRowClick?: (record: Result) => void;
}

export default function ResultTable({ data, loading, pagination, onRowClick }: Props) {
    const columns: ColumnsType<Result> = [
        {
            title: "Mã phiên thi",
            dataIndex: "examSessionCode",
            key: "examSessionCode",
            render: (text) => <span className="font-medium text-blue-600">{text}</span>
        },
        {
            title: "Mã sinh viên",
            dataIndex: "studentCode",
            key: "studentCode",
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            key: "fullName"
        },
        {
            title: "Tổng điểm",
            dataIndex: "totalScore",
            key: "totalScore",
            align: "center",
            render: (score: number) => {
                const isUnderAverage = score !== undefined && score !== null && score < 5;
                return <span className={isUnderAverage ? "text-red-500 font-semibold" : "font-semibold"}>{score ?? "-"}</span>;
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status: string) => {
                const color = status === "NOT_GRADED" ? "orange" : "green";
                return <Tag color={color}>{status || "Không xác định"}</Tag>;
            }
        }
    ];

    return (
        <Table
            rowKey="resultId"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination}
            onRow={onRowClick ? (record) => {
                return {
                    onClick: () => onRowClick(record)
                };
            } : undefined}
            rowClassName={onRowClick ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""}
        />
    );
}
