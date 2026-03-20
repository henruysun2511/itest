"use client";
import { UserJwtDecode } from "@/shares/types/body";
import { useAuthStore } from "@/stores/useAuthStore";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

// export function AuthInit() {
//     const setAuth = useAuthStore((s) => s.setAuth);
//     const setHydrated = useAuthStore((s) => s.setHydrated);

//     // res ở đây chính là chuỗi accessToken do hàm queryFn trả về
//     const { data: accessToken, isLoading } = useRefreshTokenQuery(); 

//     useEffect(() => {
//         if (isLoading) return;

//         // Không cần res?.data?.accessToken nữa vì accessToken đã là string
//         if (accessToken) {
//             try {
//                 const decoded = jwtDecode(accessToken) as UserJwtDecode;

//                 setAuth(
//                     {
//                         accountId: decoded.sub, 
//                         roleName: decoded.roleName,
//                     },
//                     accessToken
//                 );
//             } catch (error) {
//                 console.error("JWT Decode failed", error);
//             }
//         }

//         setHydrated();
//     }, [isLoading, accessToken, setAuth, setHydrated]);

//     return null;
// }

export function AuthInit() {
    const setAuth = useAuthStore((s) => s.setAuth);
    const setHydrated = useAuthStore((s) => s.setHydrated);

    useEffect(() => {
        const accessToken = Cookies.get('accessToken'); // Lấy trực tiếp từ cookie

        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken) as UserJwtDecode;
                setAuth({
                    accountId: decoded.sub,
                    roleName: decoded.roleName,
                }, accessToken);
            } catch (error) {
                console.error("JWT Decode failed", error);
            }
        }
        setHydrated();
    }, [setAuth, setHydrated]);

    return null;
}