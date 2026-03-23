import { useToast } from "@/hooks/useToast";
import { useReassignGrader } from "@/queries/useResultGradingQuery";
import { useTeacherList } from "@/queries/useTeacherQuery";
import { ResultGrading } from "@/shares/types/object";
import { handleError } from "@/shares/utils/error";
import { Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
import { ResultGradingRole } from "@/shares/constants/type.enum";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  data: ResultGrading | null;
}

export default function ResultGradingReassignModal({ open, onClose, data }: Props) {
  const [form] = Form.useForm();
  const toast = useToast();
  const { mutate: reassign, isPending } = useReassignGrader();
  const { data: teachersRaw } = useTeacherList();

  const teachers = Array.isArray(teachersRaw) ? teachersRaw : teachersRaw?.data || [];

  useEffect(() => {
    if (data && open) {
      form.setFieldsValue({
        examSessionCode: data.examSessionCode,
        role: data.role,
        oldTeacherId: undefined,
        newTeacherId: undefined
      });
    }
  }, [data, open, form]);

  const handleFinish = (values: any) => {
    reassign(
      {
        examSessionCode: values.examSessionCode,
        oldTeacherId: values.oldTeacherId,
        newTeacherId: values.newTeacherId,
        role: values.role
      },
      {
        onSuccess: (res: any) => {
          toast.success(res?.data?.message || "Reassign giám thị chấm thành công");
          onClose();
          form.resetFields();
        },
        onError: (err: any) => {
          handleError(err, toast);
        }
      }
    );
  };

  return (
    <Modal
      title="Thay đổi Phân Công Chấm Thi"
      open={open}
      onCancel={() => {
          form.resetFields();
          onClose();
      }}
      onOk={() => form.submit()}
      okText="Xác nhận đổi"
      cancelText="Hủy"
      confirmLoading={isPending}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Mã ca thi" name="examSessionCode" rules={[{ required: true }]}>
          <Input disabled className="bg-slate-100 font-semibold text-slate-700" />
        </Form.Item>

        <Form.Item label="Vai trò chấm thi" name="role" rules={[{ required: true }]}>
          <Select disabled className="pointer-events-none">
            {Object.values(ResultGradingRole).map(role => (
              <Option key={role} value={role}>{role}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Giảng viên chấm hiện tại" name="oldTeacherId" rules={[{ required: true, message: "Vui lòng chọn giảng viên bị thay thế" }]}>
          <Select placeholder="Chọn giảng viên bị thay thế" showSearch optionFilterProp="children">
            {teachers.map((t: any) => (
              <Option key={t.teacherId} value={t.teacherId}>
                {t.fullName} ({t.teacherCode})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Giảng viên chấm thay thế" name="newTeacherId" rules={[{ required: true, message: "Vui lòng chọn giảng viên mới" }]}>
          <Select placeholder="Chọn giảng viên thay thế" showSearch optionFilterProp="children">
            {teachers.map((t: any) => (
              <Option key={t.teacherId} value={t.teacherId}>
                {t.fullName} ({t.teacherCode})
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
