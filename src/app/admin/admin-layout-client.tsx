"use client";
import AdminSidebar from '@/components/admin/sidebar';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, theme } from 'antd';
import React, { useState } from 'react';

const { Header, Content } = Layout;

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();

  return (
    <Layout className="h-screen overflow-hidden">
      <AdminSidebar collapsed={collapsed} />

      <Layout className="flex flex-col">
        <Header style={{ padding: 0, background: colorBgContainer }} className="shrink-0 shadow-sm z-10">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 64, height: 64 }}
          />
        </Header>

        <Content
          style={{
            margin: "16px",
            padding: 24,
            background: "#fff",
            borderRadius: 8,
          }}
          className="flex-1 overflow-y-auto bg-slate-50"
        >
          <div className="min-h-full">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
