
import { useToast } from "@/hooks/useToast";
import { useRoleUpdate } from "@/queries/useRoleQuery";
import { Role } from "@/shares/types/object";
import { handleError } from "@/shares/utils/error";
import { Button, Form, Input, Modal } from "antd";
import { useEffect } from "react";

interface Props {
    open: boolean;
    onCancel: () => void;
    data?: Role | null;
}

export function RoleUpdateModal({ open, onCancel, data }: Props) {
    const [form] = Form.useForm();
    const { mutate, isPending } = useRoleUpdate();
    const toast = useToast();
    // Populate form when data changes
    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                roleName: data.roleName,
                description: data.description,
            });
        }
    }, [data, form]);

    // handle update role
    const handleUpdateRole = (values: Partial<Role>) => {
        if (!data) return;

        const payload = {
            id: data.roleId,
            roleName: values.roleName || "",
            description: values.description || "",
        };
        mutate(payload, {
            onSuccess: () => {
                toast.success("Cập nhật vai trò thành công");
                form.resetFields();
                onCancel();
            },
            onError: (err: any) => handleError(err, toast, "Lỗi khi cập nhật vai trò"),
        });
    };

    return (
        <Modal
            open={open}
            title="Cập nhật vai trò"
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
        >
            <Form layout="vertical" form={form} onFinish={handleUpdateRole}>
                <Form.Item 
                    name="roleName" 
                    label="Tên vai trò" 
                    rules={[{ required: true, message: "Vui lòng nhập tên vai trò!" }]}
                >
                    <Input placeholder="Nhập tên vai trò..." />
                </Form.Item>

                <Form.Item 
                    name="description" 
                    label="Mô tả" 
                    rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                >
                    <Input placeholder="Nhập mô tả..." />
                </Form.Item>

                <div className="text-right pt-4">
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