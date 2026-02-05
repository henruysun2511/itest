import { Role } from "@/types/object";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRoleDelete } from "@/queries/useRoleQuery";
import { useToast } from "@/hooks/useToast";
import { handleError } from "@/utils/error";
import { useState } from "react";
import { RoleUpdateModal } from "./role-update-modal";
interface Props {
  data: Role[];
  loading?: boolean;
  pagination?: any;
}

export default function RoleTable({ data, loading, pagination }: Props) {
  const { mutate: deleteRole } = useRoleDelete();
  const toast = useToast();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  console.log("data role table:", data);
  console.log("pagination role table:", pagination);
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
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text: string) => <span className="font-medium">{text}</span>,
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
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedRole(record);
              setOpenUpdate(true);
            }}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey="roleId"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
      />
      <RoleUpdateModal
        open={openUpdate}
        onCancel={() => {
          setOpenUpdate(false);
          setSelectedRole(null);
        }}
        data={selectedRole}
      />
    </>
  );
}
