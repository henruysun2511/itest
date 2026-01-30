import { Pagination } from "./param";

interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    pagination?: Pagination;
}

export type { ApiResponse };

export interface UserJwtDecode {
    accountId: string;
    roleId: string;
    sub?: string;      
    isPremium?: boolean;
    exp?: number;
    iat?: number;
    jti?: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}
export type { LoginResponse };

interface LoginBody {
    username: string;
    password: string;
};
export type { LoginBody };

