import {
    BarChartOutlined,
    BookOutlined,
    DashboardOutlined,
    DatabaseOutlined,
    EditOutlined,
    EyeOutlined,
    FileTextOutlined,
    FormOutlined,
    IdcardOutlined,
    SafetyOutlined,
    ScheduleOutlined,
    SettingOutlined,
    SolutionOutlined,
    TeamOutlined,
    UserOutlined,
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
                    key: '/admin/user',
                    icon: <TeamOutlined />,
                    label: <Tooltip title="Danh sách người dùng" placement='right'>Danh sách người dùng</Tooltip>,
                },
                {
                    key: '/admin/role',
                    icon: <IdcardOutlined />,
                    label: <Tooltip title="Vai trò người dùng" placement='right'>Vai trò người dùng</Tooltip>,
                },
                {
                    key: '/admin/permission',
                    icon: <SafetyOutlined />,
                    label: 'Phân quyền',
                },
            ],
        },
        {
            key: 'user',
            icon:  <ScheduleOutlined />,
            label: 'Quản lý chung',
            children: [
                {
                    key: '/admin/user',
                    icon: <UserOutlined />,
                    label: 'Sinh viên',
                },
                {
                    key: '/admin/role',
                    icon:  <SolutionOutlined />,
                    label: 'Giảng viên',
                },
                {
                    key: '/admin/permission',
                    icon: <ScheduleOutlined />,
                    label: 'Ca thi',
                },
                {
                    key: '/admin/permission',
                    icon: <BarChartOutlined />,
                    label: 'Kết quả thi',
                },
            ],
        },
        {
            key: 'exam-bank',
            icon: <DatabaseOutlined />,
            label: 'Ngân hàng đề thi',
            children: [
                {
                    key: '/admin/question-bank',
                    icon: <BookOutlined />,
                    label: 'Ngân hàng câu hỏi',
                },
                {
                    key: '/admin/exam',
                    icon: <FileTextOutlined />,
                    label: 'Đề thi',
                },
            ],
        },
        {
            key: 'exam-process',
            icon: <ScheduleOutlined />,
            label: 'Quản lý thi',
            children: [
                {
                    key: '/admin/student',
                    icon: <TeamOutlined />,
                    label: 'Thí sinh dự thi',
                },
                {
                    key: '/admin/exam-room',
                    icon: <SolutionOutlined />,
                    label: 'Phòng / ca thi',
                },
                {
                    key: '/admin/invigilator',
                    icon: <EyeOutlined />,
                    label: 'Phân công coi thi',
                },
                {
                    key: '/admin/monitor',
                    icon: <ScheduleOutlined />,
                    label: 'Theo dõi ca thi',
                },
                {
                    key: '/admin/grading',
                    icon: <FormOutlined />,
                    label: <Tooltip title="Phân công chấm tự luận" placement='right'>Phân công chấm tự luận</Tooltip>,
                },
            ],
        },
        {
            key: '/admin/manual-grading',
            icon: <EditOutlined />,
            label: 'Chấm thi tự luận',
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt chung',
        },
    ]

    const handleRouter: MenuProps['onClick'] = (e) => {
        router.push(e.key);
    };

    return (
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['user-list']}
            defaultOpenKeys={['user', 'exam']}
            items={items}
            className='bg-transparent'
            onClick={handleRouter}
        />
    )
}