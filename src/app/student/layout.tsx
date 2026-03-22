import { Metadata } from 'next';
import React from 'react';
import StudentLayoutClient from './student-layout-client';

export const metadata: Metadata = {
  title: "Sinh viên",
  description: "Bảng điều khiển dành cho Sinh viên trên hệ thống iTEST - Xem lịch thi, tham gia thi và xem kết quả trực tuyến.",
};

interface StudentLayoutProps {
    children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
    return <StudentLayoutClient>{children}</StudentLayoutClient>;
}