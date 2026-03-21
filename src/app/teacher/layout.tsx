"use client";
import UserDropdown from '@/components/common/user-dropdown';
import TeacherMenu from '@/components/teacher/teacher-menu';
import { RoleType } from '@/shares/constants/type.enum';
import { useAuthStore } from '@/stores/useAuthStore';
import { BellOutlined } from '@ant-design/icons';
import { Badge, Layout } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';


const { Header, Content } = Layout;

interface TeacherLayoutProps {
    children: React.ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
    const router = useRouter();
    const roleName = useAuthStore((state) => state.user?.roleName);

    return (
        <Layout className="min-h-screen bg-[#F0F2F5]">
            <Header className="bg-[var(--color-navy-deep)] h-20 flex items-center justify-between px-8 sticky top-0 z-[100] border-b border-white/10">
                <div className="flex items-center gap-12">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/teacher")}>
                        <div className="w-9 h-9 bg-[var(--color-accent)] rounded-lg flex items-center justify-center font-black text-[var(--color-navy-deep)] shadow-lg shadow-orange-500/20">i</div>
                        <span className="text-white font-bold text-xl tracking-tighter">iTEST TEACHER</span>
                    </div>

                    <TeacherMenu />
                </div>

                <div className="flex items-center gap-6">
                    <Badge dot color="var(--color-accent)">
                        <BellOutlined className="text-white text-xl cursor-pointer opacity-70 hover:opacity-100" />
                    </Badge>
                    <div className="h-8 w-[1px] bg-white/20"></div>

                    {/* Component User Dropdown đã tách */}
                    <UserDropdown role={(roleName as any) || RoleType.TEACHER} />
                </div>
            </Header>

            <Content className="p-0">
                {children}
            </Content>
        </Layout>
    );
}