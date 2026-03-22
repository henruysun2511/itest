import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào hệ thống iTEST để bắt đầu quá trình giảng dạy hoặc thực hiện bài thi của bạn.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
