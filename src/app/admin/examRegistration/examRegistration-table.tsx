import { useToast } from "@/hooks/useToast";
import { useRemoveRegistration, useUpdateAccessState } from "@/queries/useExamRegistrationQuery";
import { ExamRegistration } from "@/types/object";
import { DeleteOutlined, LockOutlined, UnlockOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Popconfirm, Space, Switch, Table, Tag, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";

const { Text } = Typography;

interface Props {
    data: ExamRegistration[];
    loading?: boolean;
    pagination?: any;
    sessionId: string;
}

export default function RegistrationTable({ data, loading, pagination, sessionId }: Props) {
    const toast = useToast();
    const { mutate: updateAccess, isPending: isUpdating } = useUpdateAccessState(sessionId);
    const { mutate: removeStudent, isPending: isDeleting } = useRemoveRegistration(sessionId);

    const handleToggleAccess = (registrationId: string, checked: boolean) => {
        updateAccess(
            { registrationId, data: { isAccessGranted: checked } },
            { onSuccess: () => toast.success("Đã cập nhật quyền truy cập") }
        );
    };

    const columns: ColumnsType<ExamRegistration> = [
        {
            title: "Mã sinh viên",
            key: "studentCode",
            render: (_, record) => (
                <div>{record.studentCode}</div>
            ),
        },
        {
            title: "Sinh viên",
            key: "student",
            render: (_, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div className="font-bold">{record.fullName}</div>
                </Space>
            ),
        },
        {
            title: "Số báo danh",
            key: "candidateNumber",
            render: (_, record) => (
                <div>{record.candidateNumber}</div>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status) => <Tag color="blue">{status}</Tag>
        },
        {
            title: "Quyền vào thi",
            dataIndex: "isAccessGranted",
            align: "center",
            render: (val, record) => (
                <Space direction="vertical" size={0}>
                    <Switch
                        checkedChildren={<UnlockOutlined />}
                        unCheckedChildren={<LockOutlined />}
                        checked={val}
                        loading={isUpdating}
                        onChange={(checked) => handleToggleAccess(record.registrationId, checked)}
                    />
                    <Text style={{ fontSize: '10px' }} type={val ? "success" : "danger"}>
                        {val ? "Mở" : "Khóa"}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Popconfirm
                    title="Xóa đăng ký này?"
                    onConfirm={() => removeStudent(record.studentId)}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Tooltip title="Xóa khỏi ca thi">
                        <Button type="primary"
                            danger icon={<DeleteOutlined />} loading={isDeleting} />
                    </Tooltip>
                </Popconfirm>
            ),
        },
    ];

    return (
        <Table
            rowKey="registrationId"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination}
            bordered
            scroll={{ x: 700 }}
        />
    );
}