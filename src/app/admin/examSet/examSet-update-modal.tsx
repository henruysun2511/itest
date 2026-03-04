import { useToast } from "@/hooks/useToast";
import { useExamSetUpdate } from "@/queries/useExamSetQuery";
import { ExamSet } from "@/types/object";
import { handleError } from "@/utils/error";
import { Button, Form, Input, Modal } from "antd";
import { useEffect } from "react";

interface Props {
    open: boolean;
    onCancel: () => void;
    data?: ExamSet | null;
}

export function ExamSetUpdateModal({ open, onCancel, data }: Props) {
    const [form] = Form.useForm();
    const { mutate, isPending } = useExamSetUpdate();
    const toast = useToast();

    // Populate form when data changes
    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                name: data.name,
            });
        }
    }, [data, form]);

    // handle update exam set
    const handleUpdateExamSet = (values: Partial<ExamSet>) => {
        if (!data) return;

        const payload = {
            id: data.examSetId,
            name: values.name || "",
        };

        mutate(payload, {
            onSuccess: () => {
                toast.success("Cập nhật bộ đề thành công");
                form.resetFields();
                onCancel();
            },
            onError: (err: any) =>
                handleError(err, toast, "Lỗi khi cập nhật bộ đề"),
        });
    };

    return (
        <Modal
            open={open}
            title="Cập nhật bộ đề"
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
        >
            <Form layout="vertical" form={form} onFinish={handleUpdateExamSet}>
                <Form.Item
                    name="name"
                    label="Tên bộ đề"
                    rules={[
                        { required: true, message: "Vui lòng nhập tên bộ đề!" },
                    ]}
                >
                    <Input placeholder="Nhập tên bộ đề..." />
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