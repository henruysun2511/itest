
import { useToast } from "@/hooks/useToast";
import { useCreateAccount } from "@/queries/useAccountQuery";
import { useRoleList } from "@/queries/useRoleQuery";
import { RoleType } from "@/shares/constants/type.enum";
import { Account } from "@/shares/types/object";
import { handleError } from "@/shares/utils/error";
import { Button, Form, Input, Modal, Select } from "antd";

export function AccountCreateModal({ open, onCancel }: { open: boolean; onCancel: () => void }) {
    const [form] = Form.useForm();
    const { mutate, isPending } = useCreateAccount();
    const { data: roleData, isLoading: isLoadingRoles } = useRoleList(); // Lấy data roles
    const toast = useToast();
    const roleName = Form.useWatch("roleName", form);

    const handleCreateAccount = (values: Partial<Account>) => {
        const payload = {
            username: values.username,
            password: values.password,
            roleName: values.roleName,
            code: values.code,
        };

        mutate(payload, {
            onSuccess: () => {
                toast.success("Thêm tài khoản thành công");
                form.resetFields();
                onCancel();
            },
            onError: (err: any) => handleError(err, toast, "Lỗi khi tạo tài khoản"),
        });
    };

    return (
        <Modal
            open={open}
            title="Thêm tài khoản mới"
            onCancel={onCancel}
            footer={null}
            destroyOnClose // Reset form khi đóng modal
        >
            <Form layout="vertical" form={form} onFinish={handleCreateAccount}>
                {/* Username */}
                <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
                >
                    <Input placeholder="Nhập tên đăng nhập..." />
                </Form.Item>

                {/* Password */}
                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu..." />
                </Form.Item>

                {/* Confirm Password */}
                <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    dependencies={['password']} // Phụ thuộc vào trường password
                    rules={[
                        { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Nhập lại mật khẩu..." />
                </Form.Item>

                {/* Role Name Select */}
                <Form.Item
                    name="roleName"
                    label="Vai trò"
                    rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
                >
                    <Select
                        placeholder="Chọn vai trò"
                        loading={isLoadingRoles}
                        options={roleData?.data?.map((role: any) => ({
                            label: role.roleName,
                            value: role.roleName
                        }))}
                    />
                </Form.Item>

                {/* Code (Student Code / Teacher Code) */}
                {(roleName === RoleType.STUDENT || roleName === RoleType.TEACHER) && (
                    <Form.Item
                        name="code"
                        label={roleName === RoleType.STUDENT ? "Mã sinh viên" : "Mã giảng viên"}
                        rules={[{ required: true, message: `Vui lòng nhập ${roleName === RoleType.STUDENT ? "mã sinh viên" : "mã giảng viên"}!` }]}
                    >
                        <Input placeholder={`Nhập ${roleName === RoleType.STUDENT ? "mã sinh viên" : "mã giảng viên"}...`} />
                    </Form.Item>
                )}

                <div className="text-right pt-4">
                    <Button
                        type="primary"
                        loading={isPending}
                        htmlType="submit"
                        className="bg-green"
                    >
                        Tạo tài khoản
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}