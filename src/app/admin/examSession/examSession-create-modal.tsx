// import { useToast } from "@/hooks/useToast";
// import { useCourseList } from "@/queries/useCourseQuery";
// import { useExamSessionCreate } from "@/queries/useExamSessionQuery";
// import { useExamSetList } from "@/queries/useExamSetQuery";
// import { useTeacherList } from "@/queries/useTeacherQuery";
// import { CreateExamSessionBody } from "@/types/body";
// import { handleError } from "@/utils/error";
// import {
//     Button,
//     Checkbox,
//     DatePicker,
//     Form,
//     Input,
//     InputNumber,
//     Modal,
//     Select
// } from "antd";

// interface Props {
//     open: boolean;
//     onCancel: () => void;
// }

// export function ExamSessionCreateModal({ open, onCancel }: Props) {
//     const [form] = Form.useForm();
//     const toast = useToast();
    
//     // Queries
//     const { mutate, isPending } = useExamSessionCreate();
//     const { data: teachers, isLoading: loadingTeachers } = useTeacherList();
//     const { data: courses, isLoading: loadingCourses } = useCourseList();
//     const { data: examSets, isLoading: loadingExamSets } = useExamSetList({ page: 1, limit: 100 });

//     const handleSubmit = (values: any) => {
//         const payload: CreateExamSessionBody = {
//             ...values,
//             // Chuyển đổi date từ dayjs object sang string YYYY-MM-DD
//             date: values.date.format("YYYY-MM-DD"),
//             // Đảm bảo duration là number
//             duration: Number(values.duration),
//             // Nếu không chọn giáo viên thì gửi mảng rỗng
//             teacherIds: values.teacherIds || [],
//         };

//         mutate(payload, {
//             onSuccess: () => {
//                 toast.success("Tạo ca thi mới thành công!");
//                 form.resetFields();
//                 onCancel();
//             },
//             onError: (err: any) => handleError(err, toast, "Lỗi khi tạo ca thi"),
//         });
//     };

//     return (
//         <Modal
//             open={open}
//             title="Tạo ca thi mới"
//             onCancel={onCancel}
//             footer={null}
//             width={700}
//             destroyOnClose
//         >
//             <Form
//                 form={form}
//                 layout="vertical"
//                 onFinish={handleSubmit}
//                 initialValues={{
//                     duration: 60,
//                     isCameraRequired: false,
//                     teacherIds: []
//                 }}
//             >
//                 <div className="grid grid-cols-2 gap-x-4">
//                     {/* Mã ca thi */}
//                     <Form.Item
//                         name="examSessionCode"
//                         label="Mã ca thi"
//                         rules={[{ required: true, message: "Vui lòng nhập mã ca thi!" }]}
//                     >
//                         <Input placeholder="Ví dụ: SESSION_01" />
//                     </Form.Item>

//                     {/* Ngày thi */}
//                     <Form.Item
//                         name="date"
//                         label="Ngày thi"
//                         rules={[{ required: true, message: "Vui lòng chọn ngày thi!" }]}
//                     >
//                         <DatePicker className="w-full" format="DD/MM/YYYY" />
//                     </Form.Item>

//                     {/* Khóa học */}
//                     <Form.Item
//                         name="courseId"
//                         label="Khóa học"
//                         rules={[{ required: true, message: "Vui lòng chọn khóa học!" }]}
//                     >
//                         <Select
//                             placeholder="Chọn khóa học"
//                             loading={loadingCourses}
//                             showSearch
//                             optionFilterProp="label"
//                             options={courses?.data?.map((c: any) => ({ label: c.courseName, value: c.courseId }))}
//                         />
//                     </Form.Item>

//                     {/* Bộ đề */}
//                     <Form.Item
//                         name="examSetId"
//                         label="Bộ đề thi"
//                         rules={[{ required: true, message: "Vui lòng chọn bộ đề!" }]}
//                     >
//                         <Select
//                             placeholder="Chọn bộ đề"
//                             loading={loadingExamSets}
//                             showSearch
//                             optionFilterProp="label"
//                             options={examSets?.data?.map((e: any) => ({ label: e.title, value: e.examSetId }))}
//                         />
//                     </Form.Item>

//                     {/* Phòng thi */}
//                     <Form.Item
//                         name="room"
//                         label="Phòng thi"
//                         rules={[{ required: true, message: "Vui lòng nhập phòng thi!" }]}
//                     >
//                         <Input placeholder="Ví dụ: P.402 - A1" />
//                     </Form.Item>

//                     {/* Thời lượng */}
//                     <Form.Item
//                         name="duration"
//                         label="Thời lượng (phút)"
//                         rules={[{ required: true, message: "Vui lòng nhập thời lượng!" }]}
//                     >
//                         <InputNumber min={1} className="w-full" />
//                     </Form.Item>
//                 </div>

//                 {/* Chọn giáo viên (Multi Select) */}
//                 <Form.Item
//                     name="teacherIds"
//                     label="Giáo viên coi thi"
//                 >
//                     <Select
//                         mode="multiple"
//                         placeholder="Chọn giáo viên"
//                         loading={loadingTeachers}
//                         allowClear
//                         showSearch
//                         optionFilterProp="label"
//                         options={teachers?.data?.map((t: any) => ({ 
//                             label: `${t.username} (${t.code})`, 
//                             value: t.accountId 
//                         }))}
//                     />
//                 </Form.Item>

//                 {/* Yêu cầu Camera */}
//                 <Form.Item name="isCameraRequired" valuePropName="checked">
//                     <Checkbox>Yêu cầu bật Camera khi thi</Checkbox>
//                 </Form.Item>

//                 <div className="flex justify-end gap-2 pt-4">
//                     <Button onClick={onCancel}>Hủy bỏ</Button>
//                     <Button 
//                         type="primary" 
//                         htmlType="submit" 
//                         loading={isPending}
//                         className="bg-primary"
//                     >
//                         Tạo ca thi
//                     </Button>
//                 </div>
//             </Form>
//         </Modal>
//     );
// }