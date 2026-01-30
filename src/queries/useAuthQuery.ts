import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserJwtDecode } from '@/types/body';
import { useMutation, useQuery } from "@tanstack/react-query";
import { jwtDecode } from 'jwt-decode';

export function useRefreshTokenQuery() {
    return useQuery({
        queryKey: ["auth-refresh"],
        queryFn: async () => {
            const res = await authService.refreshToken();
            return res.data.data.accessToken as string;
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
            console.log(decoded);

            setAuth({ 
                accountId: decoded.accountId,
                roleId: decoded.roleId,
            }, accessToken);
        },
    });
}

export function useLogout() {
    const logoutStore = useAuthStore((s) => s.logout);

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            logoutStore();
            window.location.href = "/";
        },
    });
}