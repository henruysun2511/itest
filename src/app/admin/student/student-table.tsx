import { GenderType } from "@/shares/constants/type.enum";
import { Student } from "@/shares/types/object";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

interface Props {
    data: Student[];
    loading?: boolean;
    pagination?: any;
}

export default function StudentTable({ data, loading, pagination }: Props) {
    const columns: ColumnsType<Student> = [
        {
            title: "Mã sinh viên",
            dataIndex: "studentCode",
            key: "studentCode",
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
            title: "Ngày sinh",
            dataIndex: "dateOfBirth",
            key: "dateOfBirth",
            render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            key: "gender",
            render: (gender: GenderType) => {
                let color = "default";
                let label = "Chưa xác định";
                if (gender === GenderType.MALE) { color = "blue"; label = "Nam"; }
                if (gender === GenderType.FEMALE) { color = "magenta"; label = "Nữ"; }
                return <Tag color={color}>{label}</Tag>;
            },
        },
        // {
        //     title: "Hành động",
        //     align: "center",
        //     render: (_, record) => (
        //         <Space>
        //             <Button 
        //                 type="link" 
        //                 icon={<EyeOutlined />}
        //                 onClick={() => console.log("Xem chi tiết", record.studentId)}
        //             >
        //                 Chi tiết
        //             </Button>
        //         </Space>
        //     ),
        // },
    ];

    return (
        <Table
            rowKey="studentId"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination}
            bordered
        />
    );
}