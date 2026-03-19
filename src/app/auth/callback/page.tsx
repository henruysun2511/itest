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
        if (token) {
            try {
                const decoded = jwtDecode(token) as UserJwtDecode;
                const expires = new Date(new Date().getTime() + 30 * 60 * 1000);

                Cookies.set("accessToken", token, {
                    expires,
                    path: "/",
                    sameSite: "strict"
                });

                setAuth({
                    accountId: decoded.sub,
                    roleName: decoded.roleName,
                }, token);

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
        <div className="flex flex-col items-center">
            <Spin size="large" className="custom-spin" />
            <p className="mt-6 text-[var(--color-navy-deep)] font-bold tracking-wide animate-pulse">
                ĐANG HOÀN TẤT ĐĂNG NHẬP...
            </p>
            <p className="text-slate-400 text-xs mt-2 uppercase tracking-[0.2em]">
                Hệ thống thi trực tuyến BA
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