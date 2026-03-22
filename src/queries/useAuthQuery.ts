import { authService } from "@/services/auth.service";
import { UserJwtDecode } from '@/shares/types/body';
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';

export function useRefreshTokenQuery() {
    return useQuery({
        queryKey: ["auth-refresh"],
        queryFn: async () => {
            try {
                const res = await authService.refreshToken();
                const token = res?.data?.data?.accessToken;

                if (!token) throw new Error("No token returned");

                return token as string;
            } catch (error) {
                throw error;
            }
        },
        retry: false,
        staleTime: Infinity,
    });
}

export function useLogin() {
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (res) => {
            const { accessToken } = res.data.data;
            const decoded = jwtDecode(accessToken) as UserJwtDecode;

            const expires = new Date(decoded.exp * 1000);

            Cookies.set("accessToken", accessToken, {
                expires: expires,
                path: "/",
                sameSite: "strict"
            });

            setAuth({
                accountId: decoded.sub,
                roleName: decoded.roleName,
            }, accessToken);

            // Trả về decoded để component xử lý điều hướng
            return decoded;
        },
    });
}

export function useLogout() {
    const logoutStore = useAuthStore((s) => s.logout);

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            Cookies.remove("accessToken");
            logoutStore();
            localStorage.clear();
            window.location.href = "/auth/login";
        },
        onError: (error) => {
            console.error("Lỗi khi đăng xuất:", error);
            Cookies.remove("accessToken");
            logoutStore();
            window.location.href = "/auth/login";
        }
    });
}

export function useLogoutDevices() {
    const logoutStore = useAuthStore((s) => s.logout);

    return useMutation({
        mutationFn: authService.logoutDevices,
        onSuccess: () => {
            Cookies.remove("accessToken");
            localStorage.clear(); // Xóa sạch dữ liệu nếu cần

            logoutStore();

            window.location.href = "/auth/login";
        },
        onError: (error) => {
            console.error("Lỗi đăng xuất:", error);
            Cookies.remove("accessToken");
            window.location.href = "/auth/login";
        }
    });
}