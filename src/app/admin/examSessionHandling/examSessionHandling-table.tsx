import { ExamSessionHandling } from "@/types/object";
import { Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";

export const handlingTypeMap: Record<string, { label: string; color: string }> = {
    WARNING: { label: "Cảnh cáo", color: "orange" },
    REPRIMAND: { label: "Khiển trách", color: "gold" },
    STOP_FOR_SESSION_TRANSFER: { label: "Dừng thi chuyển ca", color: "volcano" },
    SUSPENSION: { label: "Đình chỉ thi", color: "red" }
};

export const getHandlingTypeTag = (type: string) => {
    const tagStyle = { fontSize: '14px', padding: '2px 8px' };
    if (!type) return <Tag color="default" style={tagStyle}>Không xác định</Tag>;
    const mapped = handlingTypeMap[type?.toUpperCase()];
    return <Tag color={mapped?.color || "red"} style={tagStyle}>{mapped?.label || type}</Tag>;
};

interface Props {
    data: ExamSessionHandling[];
    loading?: boolean;
    pagination?: any;
    onViewDetail: (record: ExamSessionHandling) => void;
}

export default function FraudTable({ data, loading, pagination, onViewDetail }: Props) {
    const columns: ColumnsType<ExamSessionHandling> = [
        {
            title: "Mã ca thi",
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
            title: "Lý do",
            dataIndex: "reason",
            key: "reason",
            width: 250
        },
        {
            title: "Loại vi phạm",
            dataIndex: "type",
            key: "type",
            align: "left",
            render: (type: string) => getHandlingTypeTag(type)
        },
        {
            title: "Chi tiết",
            key: "action",
            align: "center",
            render: (_, record) => (
                <a onClick={() => onViewDetail(record)} className="text-blue-600 hover:underline">
                    Xem chi tiết
                </a>
            )
        }
    ];

    return (
        <Table
            rowKey="examSessionHandlingId"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination}
        />
    );
}
