import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/useToast";
import { useCourseList } from "@/queries/useCourseQuery";
import { useExamSetCreate } from "@/queries/useExamSetQuery";
import { handleError } from "@/utils/error";
import { Button, Form, Input, Modal, Select } from "antd";
import { useState } from "react";

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

    // 1. Quản lý trạng thái search
    const [searchValue, setSearchValue] = useState("");
    
    // 2. Debounce giá trị search để giảm số lần gọi API (ví dụ 500ms)
    const debouncedSearch = useDebounce(searchValue, 500);

    // 3. Truyền debouncedSearch vào params của query
    const { data: courseData, isLoading: isLoadingCourses } = useCourseList({
        page: 1,
        limit: 100, 
        search: debouncedSearch, // Truyền từ khóa tìm kiếm vào đây
    });

    const handleCreateExamSet = (values: any) => {
        const payload = {
            name: values.name || "",
            courseId: values.courseId, 
        };

        mutate(payload, {
            onSuccess: () => {
                toast.success("Thêm bộ đề thành công");
                form.resetFields();
                setSearchValue(""); // Reset search
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
            destroyOnClose
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleCreateExamSet}
            >
                <Form.Item
                    name="courseId"
                    label="Môn học"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn môn học!",
                        },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Tìm và chọn môn học..."
                        loading={isLoadingCourses}
                        
                        // Cấu hình để search server-side
                        filterOption={false} // Tắt lọc client-side của Antd
                        onSearch={(val) => setSearchValue(val)} // Cập nhật state khi user gõ
                        notFoundContent={isLoadingCourses ? "Đang tải..." : "Không tìm thấy môn học"}
                        
                        options={courseData?.data?.map((course: any) => ({
                            value: course.courseId,
                            label: course.name,
                        }))}
                    />
                </Form.Item>

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
                    <Button type="default" onClick={onCancel} className="mr-2">
                        Hủy
                    </Button>
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