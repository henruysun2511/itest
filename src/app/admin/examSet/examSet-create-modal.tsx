import { useToast } from "@/hooks/useToast";
import { useExamSetCreate } from "@/queries/useExamSetQuery";
import { ExamSet } from "@/types/object";
import { handleError } from "@/utils/error";
import { Button, Form, Input, Modal } from "antd";

export function ExamSetCreateModal({
    open,
    onCancel,
}: {
    open: boolean;
    onCancel: () => void;
}) {
    const [form] = Form.useForm();
    const { mutate, isPending } = useExamSetCreate();
    const toast = useToast();

    // handle create exam set
    const handleCreateExamSet = (values: Partial<ExamSet>) => {
        const payload = {
            name: values.name || "",
        };

        mutate(payload, {
            onSuccess: () => {
                toast.success("Thêm bộ đề thành công");
                form.resetFields();
                onCancel();
            },
            onError: (err: any) =>
                handleError(err, toast, "Lỗi khi tạo bộ đề"),
        });
    };

    return (
        <Modal
            open={open}
            title="Thêm bộ đề mới"
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleCreateExamSet}
            >
                {/* Name */}
                <Form.Item
                    name="name"
                    label="Tên bộ đề"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tên bộ đề!",
                        },
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
                        Tạo bộ đề
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}