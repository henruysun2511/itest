import { Fraud } from "@/shares/types/object";
import { Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
// Removed duplicate import

interface Props {
    data: Fraud[];
    loading?: boolean;
    pagination?: any;
}

export default function FraudTable({ data, loading, pagination }: Props) {
    const columns: ColumnsType<Fraud> = [
        {
            title: "Mã phiên thi",
            dataIndex: "examSessionCode",
            key: "examSessionCode",
            render: (text) => <span className="font-medium text-blue-600">{text}</span>
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            key: "fullName"
        },
        {
            title: "Mã sinh viên",
            dataIndex: "studentCode",
            key: "studentCode",
        },
        {
            title: "Loại vi phạm",
            dataIndex: "fraudType",
            key: "fraudType",
            align: "center",
            render: (type: string) => {
                const color = type ? "red" : "default";
                return <Tag color={color}>{type || "Không xác định"}</Tag>;
            }
        },
        {
            title: "Thời gian vi phạm",
            dataIndex: "occurredAt",
            key: "occurredAt",
            render: (text) => text ? new Date(text).toLocaleString("vi-VN") : ""
        }
    ];

    return (
        <Table
            rowKey="fraudDetailId"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination}
        />
    );
}
