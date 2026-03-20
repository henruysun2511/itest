"use client";

import { useToast } from "@/hooks/useToast";
import {
    useRemoveRegistration,
    useUpdateStudentAccess // 1. Dùng hook mới ở đây
} from "@/queries/useExamRegistrationQuery";
import { ExamRegistration } from "@/shares/types/object";
import { handleError } from "@/shares/utils/error";
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
    
    // 2. Khởi tạo hook mới
    const { mutate: updateStudentAccess, isPending: isUpdating } = useUpdateStudentAccess(sessionId);
    const { mutate: removeStudent, isPending: isDeleting } = useRemoveRegistration(sessionId);

    // 3. Cập nhật hàm xử lý Toggle
    const handleToggleAccess = (studentCode: string, checked: boolean) => {
        updateStudentAccess(
            { 
                studentCode, 
                isAccessGranted: checked 
            },
            {
                onSuccess: () => toast.success(`Đã ${checked ? 'mở' : 'khóa'} quyền truy cập của SV ${studentCode}`),
                onError: (error: any) => handleError(error, toast)
            }
        );
    };

    const columns: ColumnsType<ExamRegistration> = [
        {
            title: "Mã sinh viên",
            key: "studentCode",
            dataIndex: "studentCode",
            render: (text) => <Text strong>{text}</Text>,
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
            dataIndex: "candidateNumber",
            align: "center",
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
                        // 4. Truyền studentCode vào đây thay vì registrationId
                        onChange={(checked) => handleToggleAccess(record.studentCode, checked)}
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
                    onConfirm={() =>
                        removeStudent(record.studentId, { 
                            onSuccess: () => toast.success("Đã xóa sinh viên khỏi ca thi"),
                            onError: (error: any) => handleError(error, toast)
                        })
                    }
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Tooltip title="Xóa khỏi ca thi">
                        <Button 
                            type="primary"
                            danger 
                            icon={<DeleteOutlined />} 
                            loading={isDeleting} 
                        />
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