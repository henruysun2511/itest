import { AuthInit } from "@/components/provider/AuthInit";
import QueryProvider from "@/components/provider/QueryClient";
import { App } from "antd";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | iTEST - Hệ thống thi trực tuyến",
    default: "iTEST - Hệ thống tổ chức & Giám sát thi trực tuyến",
  },
  description: "iTEST là nền tảng hiện đại giúp tổ chức, quản lý và giám sát các kỳ thi trực tuyến một cách an toàn, minh bạch với sự hỗ trợ của công nghệ AI.",
  keywords: ["iTEST", "thi trực tuyến", "online examination", "giám sát thi AI", "hệ thống giáo dục"],
  authors: [{ name: "iTEST Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "iTEST - Hệ thống thi trực tuyến thông minh",
    description: "Nền tảng thi trực tuyến đa lớp bảo mật, hiệu quả cho nhà trường và doanh nghiệp.",
    url: "https://itest-system.com",
    siteName: "iTEST",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <App>
            <AuthInit />
            {children}
          </App>
        </QueryProvider>
      </body>
    </html>
  );
}
