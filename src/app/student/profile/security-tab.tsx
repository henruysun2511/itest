"use client";
import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography } from "antd";

const { Title, Text: AntText } = Typography;

interface SecurityTabProps {
    onFinish: (values: any) => void;
    isPending: boolean;
}

export function SecurityTab({ onFinish, isPending }: SecurityTabProps) {
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        onFinish(values);
        form.resetFields();
    };

    return (
        <Card 
            className="rounded-2xl border-none shadow-sm min-h-[500px] flex flex-col justify-center items-center"
        >
            <div className="w-full max-w-md"> 
                <Title level={4} className="mb-8 text-center uppercase tracking-wider">
                    Đổi mật khẩu
                </Title>
                
                <Form 
                    form={form} 
                    layout="vertical" 
                    onFinish={handleSubmit} 
                    requiredMark={false} 
                >
                    <Form.Item 
                        name="oldPassword" 
                        label={<AntText strong className="text-slate-600">Mật khẩu hiện tại</AntText>} 
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
                    >
                        <Input.Password size="large" prefix={<LockOutlined className="text-slate-300" />} className="rounded-lg" />
                    </Form.Item>

                    <Form.Item 
                        name="password" 
                        label={<AntText strong className="text-slate-600">Mật khẩu mới</AntText>} 
                        rules={[{ required: true, min: 6, message: 'Mật khẩu mới tối thiểu 6 ký tự' }]}
                    >
                        <Input.Password size="large" prefix={<LockOutlined className="text-slate-300" />} className="rounded-lg" />
                    </Form.Item>

                    <Form.Item 
                        name="passwordConfirm" 
                        label={<AntText strong className="text-slate-600">Xác nhận mật khẩu mới</AntText>} 
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận lại mật khẩu' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password size="large" prefix={<LockOutlined className="text-slate-300" />} className="rounded-lg" />
                    </Form.Item>

                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={isPending} 
                        className="bg-[var(--color-navy-main)] w-full h-12 rounded-lg font-bold mt-4 shadow-md hover:translate-y-[-1px] transition-all"
                    >
                        CẬP NHẬT MẬT KHẨU
                    </Button>
                </Form>
            </div>
        </Card>
    );
}