"use client";
import { useToast } from "@/hooks/useToast";
import { useUpdateAccountPassword } from "@/queries/useAccountQuery";
import { handleError } from "@/shares/utils/error";
import { CheckCircleOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const { Title, Text } = Typography;

export default function UpdatePasswordPage() {
    const router = useRouter();
    const toast = useToast();
    const [form] = Form.useForm();

    useEffect(() => {
        const isFirstLogin = sessionStorage.getItem("first_login_setup");
        if (!isFirstLogin) {
            toast.warning("Bạn không có quyền truy cập trang này.");
            router.replace("/");
        }
    }, [router]);

    const { mutate: updatePassword, isPending: isUpdating } = useUpdateAccountPassword();

    const onFinish = (values: any) => {
        const payload = {
            password: values.password,
            passwordConfirm: values.confirmPassword,
        };

        updatePassword(payload, {
            onSuccess: () => {
                // 1. Xóa flag thiết lập lần đầu
                sessionStorage.removeItem("first_login_setup");

                // 2. Thông báo thành công
                toast.success("Thiết lập mật khẩu thành công! Chào mừng bạn.");

                // 3. Điều hướng thẳng về trang student
                router.push("/student");
            },
            onError: (error: any) => {
                handleError(error, toast);
            }
        });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <Card className="w-full max-w-[450px] shadow-2xl border-none rounded-2xl overflow-hidden">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[var(--color-accent)] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
                        <LockOutlined className="text-2xl text-[var(--color-navy-deep)]" />
                    </div>
                    <Title level={3} className="!mb-1 !text-[var(--color-navy-deep)]">
                        Thiết lập mật khẩu
                    </Title>
                    <Text className="text-slate-500 block px-6">
                        Vui lòng thiết lập mật khẩu để hoàn tất quy trình đăng ký tài khoản.
                    </Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                    size="large"
                >
                    <Form.Item
                        name="password"
                        label={<span className="font-semibold text-slate-600">Mật khẩu mới</span>}
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-slate-400 mr-2" />}
                            placeholder="Nhập mật khẩu mới"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label={<span className="font-semibold text-slate-600">Xác nhận mật khẩu</span>}
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận lại mật khẩu!' },
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
                        <Input.Password
                            prefix={<CheckCircleOutlined className="text-slate-400 mr-2" />}
                            placeholder="Nhập lại mật khẩu"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item className="mt-8 mb-2">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isUpdating}
                            className="w-full h-12 bg-[var(--color-navy-deep)] hover:!bg-[var(--color-navy-main)] border-none font-bold rounded-lg shadow-lg"
                        >
                            HOÀN TẤT THIẾT LẬP
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}