
import { useToast } from "@/hooks/useToast";
import { useRoleCreate } from "@/queries/useRoleQuery";
import { Role } from "@/shares/types/object";
import { handleError } from "@/shares/utils/error";
import { Button, Form, Input, Modal } from "antd";

export function RoleCreateModal({ open, onCancel }: { open: boolean; onCancel: () => void }) {
    const [form] = Form.useForm();
    const { mutate, isPending } = useRoleCreate();
    const toast = useToast();
    //handle create role
    const handleCreateRole = (values: Partial<Role>) => {
        const payload = {
            roleName: values.roleName || "",
            description: values.description || "",
        };

        mutate(payload, {
            onSuccess: () => {
                toast.success("Thêm vai trò thành công");
                form.resetFields();
                onCancel();
            },
            onError: (err: any) => handleError(err, toast, "Lỗi khi tạo vai trò"),
        });
    };

    return (
        <Modal
            open={open}
            title="Thêm vai trò mới"
            onCancel={onCancel}
            footer={null}
            destroyOnHidden // Reset form khi đóng modal
        >
            <Form layout="vertical" form={form} onFinish={handleCreateRole}>
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
                        Tạo vai trò
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}