import { useToast } from "@/hooks/useToast";
import { useChangeAccountStatus, useDeleteAccount } from "@/queries/useAccountQuery";
import { AccountStatus } from "@/types/enum";
import { Account } from "@/types/object";
import { handleError } from "@/utils/error";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Switch, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";

interface Props {
    data: Account[];
    loading?: boolean;
    pagination?: any;
}

export default function AccountTable({ data, loading, pagination }: Props) {
    const { mutate: deleteAccount } = useDeleteAccount();
    const { mutate: toggleStatus } = useChangeAccountStatus();
    const toast = useToast();
    console.log(data);

    // Hàm xử lý thay đổi trạng thái
    const handleToggleStatus = (id: string, newStatus: AccountStatus) => {
        toggleStatus(
            { id, status: newStatus },
            {
                onSuccess: () => {
                    toast.success("Cập nhật trạng thái thành công");
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || "Lỗi cập nhật trạng thái");
                }
            }
        );
    };

    // Hàm xử lý xóa
    const handleDelete = (id: string) => {
        deleteAccount(id, {
            onSuccess: () => {
                toast.success("Xóa tài khoản thành công");
            },
            onError: (error: any) => {
                handleError(error, toast, "Xảy ra lỗi khi xóa tài khoản");
            }
        });
    };

    const columns: ColumnsType<Account> = [
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
            render: (text) => <span className="font-medium">{text}</span>
        },
        { title: "Email", dataIndex: "email", key: "email" },
        {
            title: "Vai trò",
            dataIndex: "role",
            render: (role) => <Tag color="blue">{role?.name || "Thành viên"}</Tag>
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            align: "center",
            render: (value: AccountStatus, record: any) => (
                <Switch
                    checked={value === AccountStatus.ACTIVE}
                    onChange={(checked) => {
                        const newStatus = checked ? AccountStatus.ACTIVE : AccountStatus.INACTIVE;
                        handleToggleStatus(record.accountId, newStatus);
                    }}
                />
            ),
        },
        {
            title: "Hành động",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="Xóa tài khoản?"
                        description="Hành động này không thể hoàn tác."
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete(record.accountId)}
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            rowKey="_id" // Đảm bảo trùng với ID từ API trả về
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination}
        />
    );
}