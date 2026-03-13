import { ExamSessionStatus } from "@/constants/status.enum";
import { useExamSessionChangeStatus } from "@/queries/useExamSessionQuery";
import { ChangeExamSessionStatusBody } from "@/types/body";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

export default function ExamSessionTable({ data, loading, pagination }: any) {
    const { mutate: changeStatus } = useExamSessionChangeStatus();

    const handleStatusUpdate = (id: string, newStatus: ChangeExamSessionStatusBody) => {
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
            title: "Bộ đề",
            dataIndex: "examSetName", // Cần map từ ID sang Name ở tầng API hoặc Frontend
            key: "examSetName",
            render: (name, record) => name || record.examSetId.slice(0, 8) // Fallback nếu chưa có name
        },
        {
            title: "Phòng",
            dataIndex: "room",
            key: "room"
        },
        {
            title: "Thời gian thi",
            key: "time",
            render: (_, record) => (
                <div>
                    ({record.duration} phút)
                </div>
            )
        },
        {
            title: "Ngày thi",
            key: "time",
            render: (_, record) => (
                <div>{dayjs(record.date).format("DD/MM/YYYY")}</div>
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 150,
            render: (status: ExamSessionStatus) => {
                switch (status) {
                    case ExamSessionStatus.IN_PROGRESS:
                        return <Tag color="processing" className="font-medium">ĐANG DIỄN RA</Tag>;
                    case ExamSessionStatus.FINISHED:
                        return <Tag color="default" className="font-medium">ĐÃ KẾT THÚC</Tag>;
                    case ExamSessionStatus.NOT_STARTED:
                        return <Tag color="warning" className="font-medium">CHƯA BẮT ĐẦU</Tag>;
                    case ExamSessionStatus.PAUSE:
                        return <Tag color="warning" className="font-medium">Tạm dừng</Tag>;
                    default:
                        return <Tag>{status}</Tag>;
                }
            }
        },
        // {
        //     title: "Trạng thái",
        //     dataIndex: "status",
        //     width: 180,
        //     render: (status: ChangeExamSessionStatusBody, record) => (
        //         <Select
        //             value={status}
        //             style={{ width: "100%" }}
        //             onChange={(val) => handleStatusUpdate(record.examSessionId, val)}
        //             options={[
        //                 { 
        //                     value: ExamSessionStatus.IN_PROGRESS, 
        //                     label: <Tag color="processing">ĐANG DIỄN RA</Tag> 
        //                 },
        //                 { 
        //                     value: ExamSessionStatus.FINISHED, 
        //                     label: <Tag color="default">ĐÃ KẾT THÚC</Tag> 
        //                 },
        //             ]}
        //         />
        //     )
        // },
        // {
        //     title: "Hành động",
        //     align: "center",
        //     render: (_, record) => (
        //         <Space>
        //             <Button type="link" size="small">Chi tiết</Button>
        //         </Space>
        //     )
        // }
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