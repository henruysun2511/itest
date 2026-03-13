import { ExamSessionStatus } from "@/constants/status.enum";
import { useExamSessionChangeStatus } from "@/queries/useExamSessionQuery";
import { ChangeExamSessionStatusBody } from "@/types/body";
import { TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function ExamSessionTable({ data, loading, pagination }: any) {
    const { mutate: changeStatus } = useExamSessionChangeStatus();
    const router = useRouter();

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
            dataIndex: "examSetName", 
            key: "examSetName",
            render: (name, record) => name || record.examSetId.slice(0, 8) 
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
        {
            title: "Quản lý",
            key: "management",
            align: "center",
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button 
                        type="primary" 
                        size="small"
                        icon={<UserAddOutlined />}
                        onClick={() => router.push(`/admin/examRegistration?examSessionId=${record.examSessionId}&code=${record.examSessionCode}`)}
                    >
                        Đăng ký sinh viên
                    </Button>
                    <Button 
                        size="small"
                        icon={<TeamOutlined />}
                        // Logic phân công coi thi tương tự nếu có trang riêng
                    >
                        Phân công
                    </Button>
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