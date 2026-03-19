"use client";
import { useLogin } from "@/queries/useAuthQuery";
import { LoginBody } from "@/shares/types/body";
import { handleError } from "@/shares/utils/error";
import {
    LockOutlined,
    SafetyOutlined,
    UserOutlined
} from "@ant-design/icons";
import { Button, Divider, Form, Image, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "../../../hooks/useToast";

export default function LoginPage() {
    const toast = useToast();
    const router = useRouter();
    const { mutate: login, isPending } = useLogin();

    const handleLogin = (values: LoginBody) => {
        const payload: LoginBody = {
            username: values.username,
            password: values.password,
        };
        login(payload, {
            onSuccess: () => {
                toast.success("Đăng nhập thành công!");
                router.push("/");
            },
            onError: (error: any) => {
                handleError(error, toast);
            }
        });
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    return (

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center mb-6">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    preview={false}
                    width={72}
                    height={72}
                />
                <h1 className="mt-3 text-lg font-semibold text-primary text-center">
                    HỌC VIỆN NGÂN HÀNG
                </h1>
                <p className="text-sm text-gray-500">
                    Hệ thống thi trực tuyến
                </p>
            </div>

            <Form
                layout="vertical"
                onFinish={handleLogin}
                autoComplete="off"
            >
                <Form.Item
                    name="username"
                    rules={[
                        { required: true, message: "Vui lòng nhập tên đăng nhập" },
                    ]}
                >
                    <Input
                        size="large"
                        prefix={<UserOutlined />}
                        placeholder="Tên đăng nhập"
                        disabled={isPending}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu" },
                    ]}
                >
                    <Input.Password
                        size="large"
                        prefix={<LockOutlined />}
                        placeholder="Mật khẩu"
                    />
                </Form.Item>

                <Form.Item
                    name="captcha"
                // rules={[
                //     { required: true, message: "Vui lòng nhập mã bảo mật" },
                // ]}
                >
                    <div className="flex gap-3 items-center">
                        <Input
                            size="large"
                            prefix={<SafetyOutlined />}
                            placeholder="Mã bảo mật"
                            disabled={isPending}
                        />
                        <div className="text-2xl font-bold">251105</div>
                    </div>
                </Form.Item>

                <Form.Item>
                    <Button
                        htmlType="submit"
                        size="large"
                        block
                        className="bg-accent text-white font-semibold hover:opacity-90 border-none"
                        disabled={isPending}
                    >
                        {isPending ? "Đang tiến hành đăng nhập" : "Đăng nhập"}
                    </Button>
                </Form.Item>
            </Form>

            <div className="mt-4 flex justify-between text-sm">
                <Link
                    href="/forgot-password"
                    className="text-gray-500 hover:text-accent"
                >
                    Quên mật khẩu?
                </Link>

                <Link
                    href="/register"
                    className="text-accent font-medium"
                >
                    Đăng ký tài khoản thí sinh
                </Link>
            </div>

            <Divider className="my-6 text-gray-400">
                hoặc
            </Divider>


            <Button
                size="large"
                block
                className="
            flex items-center justify-center gap-2
            border border-gray-300
            hover:border-accent
          "
                onClick={handleGoogleLogin}
            >
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png"
                    alt="Google"
                    preview={false}
                    width={18}
                    height={18}
                />
                Đăng nhập với Google
            </Button>
        </div>
    );
}