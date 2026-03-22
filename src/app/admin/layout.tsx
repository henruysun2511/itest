import { Metadata } from 'next';
import React from 'react';
import AdminLayoutClient from './admin-layout-client';

export const metadata: Metadata = {
  title: "Quản trị viên",
  description: "Trang quản trị dành cho Quản trị viên hệ thống iTEST - Quản lý người dùng, đề thi và cấu hình hệ thống.",
};

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}