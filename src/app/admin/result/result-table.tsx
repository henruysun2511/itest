import { Result } from "@/shares/types/object";
import { getResultStatusBadge } from "@/shares/utils/mappingLabel";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Table, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";

interface Props {
    data: Result[];
    loading?: boolean;
    pagination?: any;
    onViewDetail: (id: string) => void;
}

export default function ResultTable({ data, loading, pagination, onViewDetail }: Props) {
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
                const config = getResultStatusBadge(status);
                return (
                    <Tag color={config.color} style={{ borderRadius: '6px', fontWeight: 500 }}>
                        {config.label.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            width: 100,
            render: (_, record) => (
                <Tooltip title="Xem chi tiết">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<EyeOutlined />}
                        onClick={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện click dòng
                            onViewDetail(record.resultId);
                        }}
                        className="bg-blue-50 text-blue-600 border-none hover:bg-blue-600 hover:text-white"
                    />
                </Tooltip>
            )
        }
    ];

    return (
        <Table
            rowKey="resultId"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination}
            onRow={(record) => ({
                onClick: () => onViewDetail(record.resultId),
                className: "cursor-pointer"
            })}
        />
    );
}