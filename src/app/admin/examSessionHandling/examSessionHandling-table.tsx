import { ExamSessionHandling } from "@/shares/types/object";
import { getHandlingTypeBadge } from "@/shares/utils/mappingLabel";
import { Button, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";



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
            title: "Hình thức xử lý",
            dataIndex: "type",
            key: "type",
            align: "left",
            render: (type: string) => {
                const badge = getHandlingTypeBadge(type);
                return (
                    <Tag
                        color={badge.color}
                        style={{
                            fontSize: '13px',
                            fontWeight: 500,
                            padding: '2px 10px',
                            borderRadius: '4px'
                        }}
                    >
                        {badge.label}
                    </Tag>
                );
            }
        },
        {
            title: "Chi tiết",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Button onClick={() => onViewDetail(record)} className="text-blue-600 hover:underline">
                    Xem chi tiết
                </Button>
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
