import { useToast } from "@/hooks/useToast";
import { useRemoveExamTeacher } from "@/queries/useExamTeacherQuery";
import { ExamSessionTeacher } from "@/types/object";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Popconfirm, Space, Table, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Text } = Typography;

interface Props {
    data: ExamSessionTeacher[];
    loading?: boolean;
    pagination?: any;
    sessionId: string;
}

export default function ExamSessionTeacherTable({ data, loading, pagination, sessionId }: Props) {
    const toast = useToast();
    const { mutate: removeTeacher, isPending: isDeleting } = useRemoveExamTeacher(sessionId);

    const columns: ColumnsType<ExamSessionTeacher> = [
        {
            title: "Mã ca thi",
            dataIndex: ["examSession", "examSessionCode"],
            key: "examSessionCode",
        },
        {
            title: "Giám thị",
            key: "teacher",
            render: (_, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <div className="font-bold">{record.teacher?.account?.profile?.fullName || "Chưa cập nhật"}</div>
                        <Text type="secondary" className="text-xs">{record.teacher?.teacherCode}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: "Ngày thi",
            dataIndex: ["examSession", "date"],
            key: "date",
            render: (val) => val ? dayjs(val).format("DD/MM/YYYY") : "-",
        },
        {
            title: "Phòng thi",
            dataIndex: ["examSession", "room"],
            key: "room",
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Popconfirm
                    title="Xóa giám thị này khỏi ca thi?"
                    onConfirm={() => removeTeacher(record.examSessionTeacherId, {
                        onSuccess: () => toast.success("Đã xóa giám thị khỏi ca thi"),
                        onError: () => toast.error("Có lỗi xảy ra khi xóa giám thị")
                    })}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Tooltip title="Xóa khỏi ca thi">
                        <Button type="text" danger icon={<DeleteOutlined />} loading={isDeleting} />
                    </Tooltip>
                </Popconfirm>
            ),
        },
    ];

    return (
        <Table
            rowKey="examSessionTeacherId"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination || false}
            bordered
            scroll={{ x: 700 }}
        />
    );
}
