"use client";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserJwtDecode } from "@/types/body";
import { Spin } from "antd";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((s) => s.setAuth);

    useEffect(() => {
        // Lấy token từ URL: /auth/callback?token=...
        const token = searchParams.get("token");

        if (token) {
            try {
                // 1. Giải mã token
                const decoded = jwtDecode(token) as UserJwtDecode;

                // 2. Thiết lập thời gian hết hạn cookie (30 phút như yêu cầu)
                const expires = new Date(new Date().getTime() + 30 * 60 * 1000);

                Cookies.set("accessToken", token, {
                    expires,
                    path: "/",
                    sameSite: "strict"
                });

                // 3. Lưu vào Zustand Store (AccountId lấy từ sub)
                setAuth({
                    accountId: decoded.sub,
                    roleName: decoded.roleName,
                }, token);

                // 4. Thành công -> Về trang chủ
                router.push("/");
            } catch (error) {
                console.error("Lỗi xác thực token Google:", error);
                router.push("/auth/login");
            }
        } else {
            router.push("/auth/login");
        }
    }, [searchParams, setAuth, router]);

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
            <Spin size="large" />
            <p className="mt-4 text-gray-500 font-medium">
                Đang hoàn tất đăng nhập hệ thống...
            </p>
        </div>
    );
}