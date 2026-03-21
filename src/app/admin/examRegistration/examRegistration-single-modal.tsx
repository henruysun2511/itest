// Tạo file mới: examRegistration-single-modal.tsx
import { useToast } from "@/hooks/useToast";
import { useRegisterStudents } from "@/queries/useExamRegistrationQuery";
import { handleError } from "@/shares/utils/error";
import { Form, Input, Modal } from "antd";

interface SingleModalProps {
    open: boolean;
    onCancel: () => void;
    sessionId: string;
}

export function RegistrationSingleModal({ open, onCancel, sessionId }: SingleModalProps) {
    const [form] = Form.useForm();
    const toast = useToast();
    const registerMutation = useRegisterStudents(sessionId);

    const handleOk = async () => {
        const values = await form.validateFields();
        registerMutation.mutate([values], {
            onSuccess: () => {
                toast.success("Đăng ký sinh viên thành công")
                form.resetFields();
                onCancel();
            },
            onError: (error: any) => {
                handleError(error, toast);
            },
        });
    };

    return (
        <Modal
            title="Đăng ký học sinh mới"
            open={open}
            onOk={handleOk}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            confirmLoading={registerMutation.isPending}
            okText="Đăng ký"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical" name="single_registration">
                <Form.Item
                    name="studentCode"
                    label="Mã sinh viên"
                    rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
                >
                    <Input placeholder="Ví dụ: SV12345" />
                </Form.Item>
                <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                    <Input placeholder="Ví dụ: Nguyễn Văn A" />
                </Form.Item>
                <Form.Item
                    name="candidateNumber"
                    label="Số báo danh"
                >
                    <Input placeholder="Ví dụ: SBD-001" />
                </Form.Item>
            </Form>
        </Modal>
    );
}