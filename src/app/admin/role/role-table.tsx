import { Role } from "@/types/object";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRoleDelete } from "@/queries/useRoleQuery";
import { useToast } from "@/hooks/useToast";
import { handleError } from "@/utils/error";

interface Props {
    data: Role[];
    loading?: boolean;
    pagination?: any;
}

export default function RoleTable({ data, loading, pagination }: Props) {
    const { mutate: deleteRole } = useRoleDelete();
    const toast = useToast();
    // handle delete role
    const handleDelete = (id: string) => {
        deleteRole(id, {
            onSuccess: () => {
                toast.success("Xóa vai trò thành công");
            },
            onError: (err: any) => handleError(err, toast, "Lỗi khi xóa vai trò"),
        });
    };
    const columns: ColumnsType<Role> = [
        {
            title: "Tên vai trò",
            dataIndex: "roleName",
            key: "roleName",
            render: (text: string) => <span className="font-medium">{text}</span>
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            render: (text: string) => <span className="font-medium">{text}</span>
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="Xóa vai trò?"
                        description="Hành động này không thể hoàn tác."
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete(record.roleId)}
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />} 
                        >
                            Xóa
                        </Button>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            // onClick={() => handleEdit(record.roleId)}
                        >
                            Sửa
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Table
            rowKey="_id"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination}
        />
    );
}
