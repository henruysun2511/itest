import { Metadata } from 'next';
import React from 'react';
import TeacherLayoutClient from './teacher-layout-client';

export const metadata: Metadata = {
  title: "Giảng viên",
  description: "Bảng điều khiển dành cho Giảng viên trên hệ thống iTEST - Quản lý ca thi và học phần chuyên nghiệp.",
};

interface TeacherLayoutProps {
    children: React.ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
    return <TeacherLayoutClient>{children}</TeacherLayoutClient>;
}