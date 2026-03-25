"use client";
import { DatabaseOutlined, FormOutlined, SolutionOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

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
        path: '/teacher/examSet'
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

    // Logic xác định key đang hoạt động:
    // 1. Lọc các item mà path của nó là tiền tố của pathname hiện tại
    // 2. Sắp xếp để lấy cái có độ dài khớp lớn nhất (chính xác nhất)
    const activeKey = useMemo(() => {
        const matchingItems = TEACHER_MENU_ITEMS.filter(item => 
            pathname === item.path || pathname.startsWith(item.path + '/')
        );
        
        if (matchingItems.length === 0) return 'exam-management';

        // Trả về key của item có đường dẫn dài nhất để tránh khớp nhầm /teacher
        return matchingItems.sort((a, b) => b.path.length - a.path.length)[0].key;
    }, [pathname]);

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
            items={TEACHER_MENU_ITEMS.map(({ key, icon, label }) => ({ 
                key, 
                icon, 
                label 
            }))}
        />
    );
}