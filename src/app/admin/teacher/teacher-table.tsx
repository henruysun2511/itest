import { Teacher } from "@/shares/types/object";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";

interface Props {
    data: Teacher[];
    loading?: boolean;
    pagination?: any;
}

export default function TeacherTable({ data, loading, pagination }: Props) {
    const columns: ColumnsType<Teacher> = [
        {
            title: "Mã giảng viên",
            dataIndex: "teacherCode",
            key: "teacherCode",
            render: (text) => <span className="font-bold text-blue-600">{text}</span>,
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            key: "fullName",
            render: (text) => (
                <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <span className="font-medium">{text}</span>
                </Space>
            ),
        },
        {
            title: "Khoa/Phòng ban",
            dataIndex: "departmentId",
            key: "departmentId",
            render: (text) => text || "-",
        },
    ];

    return (
        <Table
            rowKey="teacherId"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination}
            bordered
        />
    );
}
