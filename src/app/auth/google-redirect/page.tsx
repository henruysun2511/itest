"use client";
import { useToast } from "@/hooks/useToast";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoogleRedirectPage() {
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {

        toast.error("Email không hợp lệ. Vui lòng đăng nhập bằng email có định dạng @hvnh.edu.vn");

      
        const timer = setTimeout(() => {
            router.replace("auth/login");
        }, 500);

        return () => clearTimeout(timer);
    }, [router, toast]);

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Spin size="large" tip="Đang chuyển hướng..." />
            </div>
        </div>
    );
}