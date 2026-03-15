"use client";
import {
    BellOutlined,
    LogoutOutlined,
    SolutionOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Layout } from 'antd';
import React from 'react';

const { Header, Sider, Content } = Layout;


interface StudentLayoutProps {
    children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {

    const userMenuItems = [
        { key: 'profile', label: 'Thông tin cá nhân', icon: <UserOutlined /> },
        { key: 'settings', label: 'Cài đặt tài khoản', icon: <SolutionOutlined /> },
        { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true },
    ];
    return (
        <>
            <Layout className="min-h-screen bg-[#F0F2F5]">
                <Header className="bg-[var(--color-navy-deep)] h-20 flex items-center justify-between px-8 sticky top-0 z-[100] border-b border-white/10">
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-[var(--color-accent)] rounded-lg flex items-center justify-center font-black text-[var(--color-navy-deep)] shadow-lg shadow-orange-500/20">i</div>
                            <span className="text-white font-bold text-xl tracking-tighter">iTEST STUDENT</span>
                        </div>

                    </div>

                    <div className="flex items-center gap-6">
                        <Badge dot color="var(--color-accent)">
                            <BellOutlined className="text-white text-xl cursor-pointer opacity-70 hover:opacity-100" />
                        </Badge>
                        <div className="h-8 w-[1px] bg-white/20"></div>
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                            <div className="flex items-center gap-3 cursor-pointer group px-2 py-1 rounded-lg hover:bg-white/5 transition-all">
                                <div className="flex flex-col items-end justify-center">
                                    <div className="text-white font-bold leading-tight text-sm group-hover:text-[var(--color-accent)] transition-colors">
                                        Đặng Nhật Huy
                                    </div>
                                    <span className="text-blue-300 text-[10px] uppercase font-bold tracking-wider leading-none mt-1">
                                        Sinh viên
                                    </span>
                                </div>
                                <Avatar
                                    size={42}
                                    icon={<UserOutlined />}
                                    className="bg-white/10 border border-white/20 group-hover:border-[var(--color-accent)] transition-all flex-shrink-0"
                                />
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                <Content className="p-0">
                    {children}
                </Content>


            </Layout>
        </>
    );
}