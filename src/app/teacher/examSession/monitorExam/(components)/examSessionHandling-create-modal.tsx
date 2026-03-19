import { useToast } from "@/hooks/useToast";
import { useCreateProctoringHandle } from "@/queries/useExamSessionHandlingQuery";
import { ProctoringHandleType } from "@/shares/constants/type.enum";
import { handleError } from "@/shares/utils/error";
import { PROCTORING_OPTIONS } from "@/shares/utils/mappingLabel";
import { Button, Form, Input, Modal, Select } from "antd";



interface Props {
    open: boolean;
    onCancel: () => void;
    student: {
        studentId: string;
        fullName: string;
        examAttemptId: string;
        examSessionId: string;
    } | null;
}

export default function ExamSessionHandlingModal({ open, onCancel, student }: Props) {
    const [form] = Form.useForm();
    const toast = useToast();
    const { mutate, isPending } = useCreateProctoringHandle();

    const onFinish = (values: any) => {
        if (!student) return;

        mutate({
            examAttemptId: student.examAttemptId,
            data: {
                studentId: student.studentId,
                examSessionId: student.examSessionId,
                reason: values.reason,
                type: values.type,
            }
        }, {
            onSuccess: () => {
                toast.success("Đã ghi nhận xử lý vi phạm thành công!");
                form.resetFields();
                onCancel();
            },
            onError: (err) => handleError(err, toast)
        });
    };

    return (
        <Modal
            title={`Xử lý vi phạm: ${student?.fullName || ''}`}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={600}
            destroyOnClose // Giống examSession-create-modal.tsx
        >
            <Form 
                form={form} 
                layout="vertical" 
                onFinish={onFinish}
                initialValues={{ type: ProctoringHandleType.WARNING }}
            >
                <Form.Item 
                    name="type" 
                    label="Hình thức xử lý" 
                    rules={[{ required: true, message: 'Vui lòng chọn hình thức!' }]}
                >
                    <Select 
                        placeholder="Chọn loại vi phạm" 
                        options={PROCTORING_OPTIONS}
                        className="w-full"
                    />
                </Form.Item>

                <Form.Item 
                    name="reason" 
                    label="Lý do cụ thể" 
                    rules={[{ required: true, message: 'Vui lòng nhập lý do vi phạm!' }]}
                >
                    <Input.TextArea 
                        rows={4} 
                        placeholder="Ví dụ: Sinh viên sử dụng tài liệu, trao đổi trong giờ thi..." 
                        className="rounded-xl"
                    />
                </Form.Item>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <Button onClick={onCancel}>Hủy bỏ</Button>
                    <Button 
                        type="primary" 
                        danger 
                        htmlType="submit" 
                        loading={isPending}
                        className="rounded-lg"
                    >
                        Xác nhận xử lý
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}