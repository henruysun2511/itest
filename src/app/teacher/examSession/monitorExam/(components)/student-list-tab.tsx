import { ExamRegistrationStatusType } from '@/constants/type.enum';
import { useRegistrationList, useRemoveRegistration } from '@/queries/useExamRegistrationQuery';
import { ExamRegistration } from '@/types/object';
import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, message, Modal, Table, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

const { Title, Text } = Typography;

interface StudentListTabProps {
    examSessionId: string;
}

export default function StudentListTab({ examSessionId }: StudentListTabProps) {
    // 1. Quản lý phân trang và tìm kiếm cục bộ
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        search: '',
    });

    // 2. Gọi hook lấy danh sách đăng ký
    const { data, isLoading } = useRegistrationList(examSessionId, queryParams);
    console.log(data);

    // 3. Gọi hook xóa đăng ký
    const removeMutation = useRemoveRegistration(examSessionId);

    // 4. Xử lý hành động xóa
    const handleDelete = (record: ExamRegistration) => {
        Modal.confirm({
            title: 'Xác nhận xóa thí sinh?',
            content: `Bạn có chắc chắn muốn xóa thí sinh ${record.fullName} (${record.studentCode}) khỏi ca thi này?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => {
                removeMutation.mutate(record.studentId, {
                    onSuccess: () => message.success('Đã xóa thí sinh thành công'),
                    onError: () => message.error('Không thể xóa thí sinh này'),
                });
            },
        });
    };

    // 5. Định nghĩa cột cho bảng
    const columns: ColumnsType<ExamRegistration> = [
        {
            title: 'Mã sinh viên',
            dataIndex: 'studentCode',
            key: 'studentCode',
            width: 150,
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text) => <span><UserOutlined className="mr-2" />{text || 'Chưa cập nhật'}</span>,
        },
        {
            title: 'Số báo danh',
            dataIndex: 'candidateNumber',
            key: 'candidateNumber',
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: ExamRegistrationStatusType) => {
                const color = status === ExamRegistrationStatusType.REGISTERED ? 'green' : 'blue';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Quyền truy cập',
            dataIndex: 'isAccessGranted',
            key: 'isAccessGranted',
            render: (granted: boolean) => (
                <Tag color={granted ? 'success' : 'error'}>
                    {granted ? 'Được phép' : 'Bị khóa'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Tooltip title="Xóa khỏi ca thi">
                    <Button
                        type="text"
                        danger
                        className='text-white'
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                        loading={removeMutation.isPending && removeMutation.variables === record.studentId}
                    />
                </Tooltip>

            ),
        },
    ];

    return (
        <Card className="rounded-xl shadow-sm border-none">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title level={4} className="!mb-0">Danh sách thí sinh đăng ký</Title>
                    <Text type="secondary">
                        Tổng số thí sinh: {data?.data.length || 0}
                    </Text>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={data?.data || []}
                rowKey="registrationId" // Sử dụng registrationId làm key
                loading={isLoading}
                pagination={{
                    current: queryParams.page,
                    pageSize: queryParams.limit,
                    total: data?.data.length || 0, // Thay bằng meta.total nếu API có trả về phân trang
                    onChange: (page) => setQueryParams(prev => ({ ...prev, page })),
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50']
                }}
                className="custom-ant-table"
            />
        </Card>
    );
}