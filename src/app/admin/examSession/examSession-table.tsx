import { ExamSessionStatus } from "@/constants/status.enum";
import { useExamSessionChangeStatus } from "@/queries/useExamSessionQuery";
import { Button, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

export default function ExamSessionTable({ data, loading, pagination }: any) {
    const { mutate: changeStatus } = useExamSessionChangeStatus();

    const handleStatusUpdate = (id: string, newStatus: ExamSessionStatus) => {
        changeStatus({ id, data: { status: newStatus } });
    };

    const columns: ColumnsType<any> = [
        { 
            title: "Mã ca thi", 
            dataIndex: "examSessionCode", 
            key: "examSessionCode",
            render: (text) => <span className="font-bold text-blue-600">{text}</span>
        },
        { 
            title: "Ngày thi", 
            dataIndex: "date", 
            render: (date) => dayjs(date).format("DD/MM/YYYY") 
        },
        { title: "Bắt đầu", dataIndex: "startTime" },
        { title: "Kết thúc", dataIndex: "endTime" },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 180,
            render: (status: ExamSessionStatus, record) => (
                <Select
                    value={status}
                    style={{ width: "100%" }}
                    onChange={(val) => handleStatusUpdate(record.examSessionId, val)}
                    options={[
                        { 
                            value: ExamSessionStatus.IN_PROGRESS, 
                            label: <Tag color="processing">ĐANG DIỄN RA</Tag> 
                        },
                        { 
                            value: ExamSessionStatus.FINISHED, 
                            label: <Tag color="default">ĐÃ KẾT THÚC</Tag> 
                        },
                    ]}
                />
            )
        },
        {
            title: "Hành động",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Button type="link" size="small">Chi tiết</Button>
                </Space>
            )
        }
    ];

    return (
        <Table
            rowKey="examSessionId"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination}
            bordered
        />
    );
}