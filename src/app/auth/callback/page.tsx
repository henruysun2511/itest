"use client";
import { UserJwtDecode } from "@/shares/types/body";
import { useAuthStore } from "@/stores/useAuthStore";
import { Spin } from "antd";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function AuthCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((s) => s.setAuth);

    useEffect(() => {
        const token = searchParams.get("token");
        const isPasswordSetParam = searchParams.get("isPasswordSet");
        
        // Chuyển thành boolean để xử lý logic
        const isPasswordSet = isPasswordSetParam === "true";

        if (token) {
            try {
                const decoded = jwtDecode(token) as UserJwtDecode;
                const expires = new Date(new Date().getTime() + 30 * 60 * 1000);

                // 1. Lưu Token vào Cookie
                Cookies.set("accessToken", token, {
                    expires,
                    path: "/",
                    sameSite: "strict"
                });

                // 2. Cập nhật Zustand Store
                setAuth({
                    accountId: decoded.sub,
                    roleName: decoded.roleName,
                }, token);

                // 3. XỬ LÝ FLAG VÀ ĐIỀU HƯỚNG
                if (!isPasswordSet) {
                    // Đánh dấu vào sessionStorage: "Người dùng này cần đặt mật khẩu ngay"
                    sessionStorage.setItem("first_login_setup", "true");
                    
                    // Điều hướng sang trang cập nhật mật khẩu
                    router.push("/auth/updatePassword");
                } else {
                    // Nếu đã có mật khẩu, đảm bảo xóa flag cũ (nếu có) và về trang chủ
                    sessionStorage.removeItem("first_login_setup");
                    router.push("/student");
                }
                
            } catch (error) {
                console.error("Lỗi xác thực token Google:", error);
                router.push("/auth/login");
            }
        } else {
            router.push("/auth/login");
        }
    }, [searchParams, setAuth, router]);

    return (
        <div className="flex flex-col items-center">
            <Spin size="large" className="custom-spin" />
            <p className="mt-6 text-[var(--color-navy-deep)] font-bold tracking-wide animate-pulse uppercase">
                Đang kiểm tra thông tin tài khoản...
            </p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-white">
            <Suspense fallback={<Spin size="large" />}>
                <AuthCallbackHandler />
            </Suspense>
        </div>
    );
}