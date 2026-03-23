import { ResultGradingStatus } from "@/shares/constants/status.enum";
import { ResultGrading } from "@/shares/types/object";
import { EditOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface Props {
    data: ResultGrading[];
    loading?: boolean;
    onReassign: (record: ResultGrading) => void;
    pagination: any;
}

export default function ResultGradingTable({ data, loading, onReassign, pagination }: Props) {
    const columns: ColumnsType<ResultGrading> = [
        {
            title: 'Sinh viên',
            key: 'student',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.studentFullName}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.studentCode}</Text>
                </Space>
            )
        },
        {
            title: 'Mã ca thi',
            dataIndex: 'examSessionCode',
            key: 'examSessionCode',
            render: (val) => <Text strong>{val}</Text>
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (val) => <Tag color="blue">{val}</Tag>
        },
        {
            title: 'Điểm',
            dataIndex: 'totalScore',
            key: 'totalScore',
            render: (val) => <Text strong className="text-green-600">{val ?? '-'}</Text>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (val) => {
                let color = "default";
                if (val === ResultGradingStatus.ASSIGNED) color = "warning";
                else if (val === ResultGradingStatus.GRADING) color = "processing";
                else if (val === ResultGradingStatus.COMPLETED) color = "success";
                
                return <Tag color={color}>{val}</Tag>;
            }
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <Tooltip title="Chỉnh sửa / Assign">
                    <Button 
                        type="text" 
                        icon={<EditOutlined className="text-blue-500" />} 
                        onClick={() => onReassign(record)}
                    />
                </Tooltip>
            )
        }
    ];

    return (
        <Table
            dataSource={data}
            loading={loading}
            columns={columns}
            rowKey="resultGradingId"
            pagination={pagination}
            bordered
            scroll={{ x: 800 }}
            className="bg-white rounded-lg"
        />
    );
}
