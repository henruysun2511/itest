import { useToast } from "@/hooks/useToast";
import { useCreateExamTeacher } from "@/queries/useExamSessionTeacherQuery";
import { useTeacherList } from "@/queries/useTeacherQuery";
import { Teacher } from "@/shares/types/object";
import { handleError } from "@/shares/utils/error";
import { Button, Form, Modal, Select } from "antd";

interface Props {
    open: boolean;
    onCancel: () => void;
    sessionId: string;
}

export function ExamSessionTeacherCreateModal({ open, onCancel, sessionId }: Props) {
    const [form] = Form.useForm();
    const toast = useToast();

    const { mutate, isPending } = useCreateExamTeacher(sessionId);
    const { data: teachersData, isLoading: isLoadingTeachers } = useTeacherList();
    console.log(teachersData);


    const handleSubmit = (values: { teacherIds: string[] }) => {
        if (!values.teacherIds || values.teacherIds.length === 0) {
            toast.error("Vui lòng chọn ít nhất một giám thị");
            return;
        }
        mutate({
            examSessionId: sessionId,
            teacherIds: values.teacherIds
        }, {
            onSuccess: () => {
                toast.success("Thêm giám thị thành công!");
                form.resetFields();
                onCancel();
            },
            onError: (err: any) => handleError(err, toast, "Lỗi khi thêm giám thị"),
        });
    };

    return (
        <Modal
            open={open}
            title="Thêm giám thị vào ca thi"
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="teacherIds"
                    label="Chọn giám thị"
                    rules={[{ required: true, message: "Vui lòng chọn giám thị!" }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Có thể chọn nhiều giám thị..."
                        style={{ width: '100%' }}
                        options={teachersData?.data?.map((teacher: Teacher) => ({
                            value: teacher.teacherId,
                            label: teacher.fullName,
                        }))}
                        loading={isLoadingTeachers}
                        showSearch
                        optionFilterProp="label"
                        allowClear
                    />
                </Form.Item>

                <div className="flex justify-end gap-2 pt-4">
                    <Button onClick={onCancel}>Hủy</Button>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={isPending}
                        className="bg-primary"
                    >
                        Thêm mới
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
