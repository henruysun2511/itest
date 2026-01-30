"use client";
import { Layout } from 'antd';
import React from 'react';

const { Header, Sider, Content } = Layout;

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {children}
        </Layout>
    );
}