import {
    AppstoreAddOutlined,
    AuditOutlined,
    BankOutlined,
    BarChartOutlined,
    BookOutlined,
    DashboardOutlined,
    DatabaseOutlined,
    FileTextOutlined,
    FormOutlined,
    IdcardOutlined,
    ReadOutlined,
    SafetyCertificateOutlined,
    ScheduleOutlined,
    SettingOutlined,
    SolutionOutlined,
    TeamOutlined,
    UsergroupAddOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Menu, MenuProps, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';

export default function AdminMenu() {
    const router = useRouter();

    const items = [
        {
            key: 'overview',
            icon: <DashboardOutlined />,
            label: 'Tổng quan',
        },
        {
            key: 'user',
            icon: <UserOutlined />,
            label: 'Quản lý người dùng',
            children: [
                {
                    key: '/admin/account',
                    icon: <TeamOutlined />,
                    label: <Tooltip title="Danh sách người dùng" placement='right'>Danh sách người dùng</Tooltip>,
                },
                {
                    key: '/admin/role',
                    icon: <IdcardOutlined />,
                    label: <Tooltip title="Vai trò người dùng" placement='right'>Vai trò người dùng</Tooltip>,
                },
            ],
        },
        {
            key: 'general-management',
            icon: <BankOutlined />, // Thay đổi icon tổng quát cho quản lý chung
            label: 'Quản lý chung',
            children: [
                {
                    key: '/admin/student',
                    icon: <UserOutlined />,
                    label: 'Sinh viên',
                },
                {
                    key: '/admin/teacher',
                    icon: <SolutionOutlined />,
                    label: 'Giảng viên',
                },
                {
                    key: '/admin/department',
                    icon: <BankOutlined />, 
                    label: 'Phòng ban',
                },
                {
                    key: '/admin/course',
                    icon: <ReadOutlined />, 
                    label: 'Bộ môn',
                },
            ],
        },
        {
            key: 'exam-bank',
            icon: <DatabaseOutlined />,
            label: 'Ngân hàng đề thi',
            children: [
                {
                    key: '/admin/examSet',
                    icon: <BookOutlined />,
                    label: 'Bộ đề thi',
                },
                {
                    key: '/admin/exam',
                    icon: <FileTextOutlined />,
                    label: 'Đề thi',
                },
                {
                    key: '/admin/examApprove', 
                    icon: <AuditOutlined />,
                    label: 'Duyệt đề thi',
                },
            ],
        },
        {
            key: 'exam-process',
            icon: <ScheduleOutlined />,
            label: 'Quản lý thi',
            children: [
                {
                    key: '/admin/examSession',
                    icon: <ScheduleOutlined />,
                    label: 'Ca thi',
                },
                {
                    key: '/admin/examRegistration',
                    icon: <AppstoreAddOutlined />, 
                    label: 'Đăng ký thi sinh viên',
                },
                {
                    key: '/admin/examSessionTeacher',
                    icon: <UsergroupAddOutlined />, 
                    label: 'Phân công coi thi',
                },
                {
                    key: '/admin/result',
                    icon: <BarChartOutlined />,
                    label: 'Kết quả thi',
                },
                {
                    key: '/admin/fraud',
                    icon: <SafetyCertificateOutlined />, 
                    label: 'Báo cáo gian lận',
                },
            ],
        },
        {
            key: '/admin/grading',
            icon: <FormOutlined />, 
            label: 'Phân công chấm tự luận',
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt chung',
        },
    ];

    const handleRouter: MenuProps['onClick'] = (e) => {
        router.push(e.key);
    };

    return (
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['user']}
            defaultOpenKeys={['1', '2']}
            items={items}
            className='bg-transparent'
            onClick={handleRouter}
        />
    )
}