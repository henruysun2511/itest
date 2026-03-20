"use client";

import { useToast } from '@/hooks/useToast';
import { useUpdateStudentPassword } from '@/queries/useAccountQuery'; // Import hook cập nhật pass
import { useRegistrationList, useRemoveRegistration, useUpdateAccessState, useUpdateStudentAccess } from '@/queries/useExamRegistrationQuery';
import { ExamRegistration } from '@/shares/types/object';
import { handleError } from '@/shares/utils/error';
import { DeleteOutlined, KeyOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Modal, Space, Switch, Table, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';

const { Title, Text } = Typography;

interface StudentListTabProps {
    examSessionId: string;
}

export default function StudentListTab({ examSessionId }: StudentListTabProps) {
    const toast = useToast();
    const [form] = Form.useForm();
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        search: '',
    });

    // State quản lý Modal đổi mật khẩu
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<ExamRegistration | null>(null);

    // Hooks
    const { data, isLoading } = useRegistrationList(examSessionId, queryParams);
    console.log(data)
    const removeMutation = useRemoveRegistration(examSessionId);
    const updateAccessMutation = useUpdateStudentAccess(examSessionId);
    const updatePasswordMutation = useUpdateStudentPassword();
    const updateBulkAccess = useUpdateAccessState(examSessionId);

    const isAllAccessGranted = useMemo(() => {
        if (!data?.data || data.data.length === 0) return false;
        return data.data.every((student: any) => student.isAccessGranted);
    }, [data]);

    // Xử lý đổi mật khẩu
    const handleUpdatePassword = async (values: any) => {
        if (!selectedStudent) return;

        updatePasswordMutation.mutate({
            examSessionId,
            payload: {
                studentAccountId: selectedStudent.studentId,
                password: values.password,
                passwordConfirm: values.confirmPassword
            }
        }, {
            onSuccess: () => {
                toast.success(`Cập nhật mật khẩu cho SV ${selectedStudent.studentCode} thành công`);
                setIsPasswordModalOpen(false);
                form.resetFields();
            },
            onError: (err: any) => handleError(err, toast)
        });
    };

    const handleToggleAllAccess = (checked: boolean) => {
        updateBulkAccess.mutate(
            {
                examSessionId: examSessionId, 
                data: { isAccessGranted: checked }
            },
            {
                onSuccess: () => {
                    toast.success(`Đã ${checked ? 'mở' : 'khóa'} quyền truy cập cho toàn bộ ca thi`);
                },
                onError: (error: any) => {
                    handleError(error, toast);
                }
            }
        );
    };

    const columns: ColumnsType<ExamRegistration> = [
        {
            title: 'Mã sinh viên',
            dataIndex: 'studentCode',
            key: 'studentCode',
            width: 120,
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Họ và tên',
            key: 'fullName',
            render: (_, record) => (
                <Text>{record.fullName || 'Chưa cập nhật'}</Text>
            ),
        },
        {
            title: 'Số báo danh',
            dataIndex: 'candidateNumber',
            key: 'candidateNumber',
            align: 'center',
            render: (num) => <Tag color="orange">{num}</Tag>
        },
        {
            title: 'Quyền truy cập',
            dataIndex: 'isAccessGranted',
            key: 'isAccessGranted',
            align: 'center',
            render: (granted: boolean, record) => (
                <Switch
                    size="small"
                    checkedChildren={<UnlockOutlined />}
                    unCheckedChildren={<LockOutlined />}
                    checked={granted}
                    loading={updateAccessMutation.isPending && updateAccessMutation.variables?.studentCode === record.studentCode}
                    onChange={(checked) => {
                        updateAccessMutation.mutate({ studentCode: record.studentCode, isAccessGranted: checked }, {
                            onSuccess: () => message.success("Đã cập nhật quyền")
                        });
                    }}
                />
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space>
                    {/* Nút Đổi mật khẩu */}
                    <Tooltip title="Đổi mật khẩu">
                        <Button
                            type="text"
                            icon={<KeyOutlined />}
                            onClick={() => {
                                setSelectedStudent(record);
                                setIsPasswordModalOpen(true);
                            }}
                        />
                    </Tooltip>

                    {/* Nút Xóa */}
                    <Tooltip title="Xóa khỏi ca thi">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                Modal.confirm({
                                    title: 'Xóa thí sinh?',
                                    onOk: () => removeMutation.mutate(record.studentId)
                                });
                            }}
                            loading={removeMutation.isPending && removeMutation.variables === record.studentId}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card className="rounded-xl shadow-sm border-none">
            <div className="flex justify-between items-center mb-6">
                <Title level={4}>Danh sách thí sinh</Title>

                {/* Switch cập nhật toàn bộ ca thi */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Space direction="vertical" align="end" size={0}>
                        <Text strong style={{ fontSize: '12px' }} className="mb-1 uppercase text-gray-500">
                            Quyền truy cập toàn ca thi
                        </Text>
                        <Space>
                            <Text type={isAllAccessGranted ? "success" : "danger"} className="text-xs">
                                {isAllAccessGranted ? "ĐANG MỞ" : "ĐANG KHÓA"}
                            </Text>
                            <Switch
                                checkedChildren={<UnlockOutlined />}
                                unCheckedChildren={<LockOutlined />}
                                checked={isAllAccessGranted}
                                loading={updateBulkAccess.isPending}
                                onChange={handleToggleAllAccess}
                            />
                        </Space>
                    </Space>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={data?.data || []}
                rowKey="registrationId"
                loading={isLoading}
                pagination={{
                    current: queryParams.page,
                    pageSize: queryParams.limit,
                    total: data?.meta?.total || 0,
                    onChange: (page, limit) => setQueryParams(p => ({ ...p, page, limit }))
                }}
            />

            {/* Modal Cập nhật mật khẩu */}
            <Modal
                title={`Đổi mật khẩu: ${selectedStudent?.fullName}`}
                open={isPasswordModalOpen}
                onCancel={() => setIsPasswordModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={updatePasswordMutation.isPending}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleUpdatePassword}>
                    <Form.Item
                        label="Mật khẩu mới"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }, { min: 6, message: 'Tối thiểu 6 ký tự' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Xác nhận mật khẩu mới" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}