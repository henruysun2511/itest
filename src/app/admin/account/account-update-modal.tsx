
import { useToast } from "@/hooks/useToast";
import { useUpdateAccount } from "@/queries/useAccountQuery";
import { useRoleList } from "@/queries/useRoleQuery";
import { Account } from "@/types/object";
import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";

type Props = {
    open: boolean;
    onCancel: () => void;
    data?: Account | null;
};

export function AccountUpdateModal({ open, onCancel, data }: Props) {
    const [form] = Form.useForm();
    const { mutate, isPending } = useUpdateAccount();
    const { data: roleRes, isLoading: isLoadingRoles } = useRoleList();
    const toast = useToast();

    // Map data vào form khi mở modal
    useEffect(() => {
        if (data && open) {
            form.setFieldsValue({
                username: data.username,
                roleName: data.role?.name, 
                status: data.status,
            });
        }
    }, [data, open, form]);

    const handleUpdateAccount = (values: any) => {
        if (!data?.accountId) return;

        mutate(
            {
                id: data.accountId,
                data: values,
            },
            {
                onSuccess: () => {
                    toast.success("Cập nhật tài khoản thành công");
                    onCancel();
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.message || "Lỗi khi cập nhật");
                },
            }
        );
    };

    return (
        <Modal
            open={open}
            title="Chỉnh sửa tài khoản"
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form layout="vertical" form={form} onFinish={handleUpdateAccount}>
                <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[{ required: true, message: "Không được để trống" }]}
                >
                    <Input placeholder="Nhập tên đăng nhập..." />
                </Form.Item>

                <Form.Item
                    name="roleName"
                    label="Vai trò"
                    rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                >
                    <Select
                        placeholder="Chọn vai trò"
                        loading={isLoadingRoles}
                        options={roleRes?.data?.map((role: any) => ({
                            label: role.name,
                            value: role.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Trạng thái"
                    rules={[{ required: true }]}
                >
                    <Select
                        options={[
                            { label: "Hoạt động", value: AccountStatus.ACTIVE },
                            { label: "Khóa", value: AccountStatus.INACTIVE },
                        ]}
                    />
                </Form.Item>

                <div className="text-right pt-4">
                    <Button onClick={onCancel} className="mr-2">
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        loading={isPending}
                        htmlType="submit"
                        className="bg-green"
                    >
                        Lưu thay đổi
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}