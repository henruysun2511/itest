"use client";
import { DatabaseOutlined, FormOutlined, SolutionOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

export const TEACHER_MENU_ITEMS = [
    { 
        key: 'exam-management', 
        icon: <SolutionOutlined />, 
        label: 'Quản lý thi',
        path: '/teacher/exam-management' 
    },
    { 
        key: 'bank', 
        icon: <DatabaseOutlined />, 
        label: 'Ngân hàng đề',
        path: '/teacher/bank'
    },
    { 
        key: 'grading', 
        icon: <FormOutlined />, 
        label: 'Chấm tự luận',
        path: '/teacher/grading'
    },
];

export default function TeacherMenu() {
    const router = useRouter();
    const pathname = usePathname();

    const activeKey = TEACHER_MENU_ITEMS.find(item => pathname.includes(item.path))?.key || 'exam-management';

    return (
        <Menu
            mode="horizontal"
            selectedKeys={[activeKey]}
            className="bg-transparent border-none text-white w-[500px] font-medium opacity-90 teacher-top-menu"
            onClick={({ key }) => {
                const item = TEACHER_MENU_ITEMS.find(i => i.key === key);
                if (item) router.push(item.path);
            }}
            items={TEACHER_MENU_ITEMS.map(({ key, icon, label }) => ({ key, icon, label }))}
        />
    );
}