import { useToast } from "@/hooks/useToast";
import { useAssignGraders } from "@/queries/useResultGradingQuery";
import { useTeacherList } from "@/queries/useTeacherQuery";
import { useExamSessionList } from "@/queries/useExamSessionQuery";
import { ResultGradingRole } from "@/shares/constants/type.enum";
import { handleError } from "@/shares/utils/error";
import { Form, Modal, Select, Spin, Input } from "antd";
import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ResultGradingAssignModal({ open, onClose }: Props) {
  const [form] = Form.useForm();
  const toast = useToast();
  
  const [searchSession, setSearchSession] = useState("");

  const { mutate: assignGraders, isPending } = useAssignGraders();
  const { data: teachersRaw } = useTeacherList();
  
  const debouncedSearchSession = useDebounce(searchSession, 500);

  const { data: sessionsRaw, isLoading: isSessionsLoading } = useExamSessionList({ 
    page: 1, 
    limit: 20, 
    search: debouncedSearchSession 
  });

  const teachers = Array.isArray(teachersRaw) ? teachersRaw : teachersRaw?.data || [];
  const sessions = sessionsRaw?.data || [];

  const handleSearchSession = (val: string) => {
    setSearchSession(val);
  };

  const handleFinish = (values: any) => {
    assignGraders(
      {
        examSessionCode: values.examSessionCode,
        teacherIds: values.teacherIds,
        role: values.role
      },
      {
        onSuccess: (res: any) => {
          toast.success(res?.data?.message || "Phân công chấm thi thành công");
          onClose();
          form.resetFields();
          setSearchSession("");
        },
        onError: (err: any) => {
          handleError(err, toast);
        }
      }
    );
  };

  return (
    <Modal
      title="Khởi tạo Phân công Chấm thi"
      open={open}
      onCancel={() => {
          form.resetFields();
          setSearchSession("");
          onClose();
      }}
      onOk={() => form.submit()}
      okText="Xác nhận phân công"
      cancelText="Hủy bỏ"
      confirmLoading={isPending}
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleFinish} 
        initialValues={{ role: ResultGradingRole.REVIEWER }}
      >
        <Form.Item 
          label="Mã ca thi" 
          name="examSessionCode" 
          rules={[{ required: true, message: "Vui lòng tìm và chọn mã ca thi!" }]}
        >
          <Select
            placeholder="Tìm theo mã ca thi (nhập tên/code để tìm)"
            showSearch
            filterOption={false}
            onSearch={handleSearchSession}
            notFoundContent={isSessionsLoading ? <Spin size="small" /> : null}
          >
            {sessions.map((s: any) => (
              <Option key={s.examSessionCode} value={s.examSessionCode}>
                {s.examSessionCode} - Phòng: {s.room}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          label="Vai trò chấm thi" 
          name="role" 
          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        >
          <Select placeholder="Chọn vai trò">
            {Object.values(ResultGradingRole).map(role => (
              <Option key={role} value={role}>{role}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          label="Chọn danh sách giảng viên chấm thi" 
          name="teacherIds" 
          rules={[{ required: true, message: "Hãy chọn ít nhất một giảng viên" }]}
        >
          <Select 
            mode="multiple" 
            placeholder="Tìm theo tên hoặc mã giảng viên" 
            showSearch 
            optionFilterProp="children"
            maxTagCount="responsive"
          >
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
