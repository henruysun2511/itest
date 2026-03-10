import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserJwtDecode } from '@/types/body';
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

            const expires = new Date(new Date().getTime() + 30 * 60 * 1000);

            Cookies.set("accessToken", accessToken, { 
                expires: expires, 
                path: "/", 
                sameSite: "strict" 
            });

            setAuth({ 
                accountId: decoded.sub, 
                roleName: decoded.roleName,
            }, accessToken);
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
            window.location.href = "/";
        },
    });
}