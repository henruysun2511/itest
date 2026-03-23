"use client";
import { DatabaseOutlined, FormOutlined, SolutionOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

export const TEACHER_MENU_ITEMS = [
    {
        key: 'exam-management',
        icon: <SolutionOutlined />,
        label: 'Quản lý thi',
        path: '/teacher'
    },
    {
        key: 'bank',
        icon: <DatabaseOutlined />,
        label: 'Ngân hàng đề',
        path: '/teacher/questionBank'
    },
    {
        key: 'grading',
        icon: <FormOutlined />,
        label: 'Chấm tự luận',
        path: '/teacher/essayGrading'
    },
];

export default function TeacherMenu() {
    const router = useRouter();
    const pathname = usePathname();

    const activeKey = TEACHER_MENU_ITEMS.find(item => pathname.includes(item.path))?.key || 'exam-management';

    return (
        <Menu
            mode="horizontal"
            theme="dark"
            selectedKeys={[activeKey]}
            className="bg-transparent border-none w-[500px] font-medium"
            onClick={({ key }) => {
                const item = TEACHER_MENU_ITEMS.find(i => i.key === key);
                if (item) router.push(item.path);
            }}
            items={TEACHER_MENU_ITEMS.map(({ key, icon, label }) => ({ key, icon, label }))}
        />
    );
}