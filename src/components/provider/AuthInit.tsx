"use client";
import { useRefreshTokenQuery } from "@/queries/useAuthQuery";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserJwtDecode } from "@/types/body";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export function AuthInit() {
    const setAuth = useAuthStore((s) => s.setAuth);
    const setHydrated = useAuthStore((s) => s.setHydrated);

    const { data: accessToken, error, isLoading } = useRefreshTokenQuery();

    useEffect(() => {
        if (isLoading) return;

        if (accessToken) {
            const decoded = jwtDecode(accessToken) as UserJwtDecode;

            setAuth(
                {
                    accountId: decoded.accountId,
                    roleId: decoded.roleId,
                },
                accessToken
            );
        }

        // Dù success hay fail -> app biết auth đã check xong
        setHydrated();
    }, [isLoading, accessToken, setAuth, setHydrated]);

    return null;
}