import { AccountStatus } from "@/shares/constants/status.enum";
import { ApiResponse, BulkAccountBody } from "@/shares/types/body";
import { Account } from "@/shares/types/object";
import { AccountParam } from "@/shares/types/param";
import http from "@/shares/utils/http";

const prefix = "accounts";

export const AccountService = {
    // GET /accounts - Lấy danh sách tài khoản
    getList(params: AccountParam) {
        return http.get<ApiResponse<Account[]>>(
            `/${prefix}`,
            { params }
        );
    },

    // POST /accounts - Tạo tài khoản mới
    create(payload: Partial<Account>) {
        return http.post<ApiResponse<Account>>(
            `/${prefix}`,
            payload
        );
    },

    createBulk(payload: BulkAccountBody) {
        return http.post<ApiResponse<Account[]>>(
            `/${prefix}/bulk`,
            payload
        );
    },

    // PATCH /accounts/password - Cập nhật mật khẩu
    updatePassword(payload: Partial<Account>) {
        return http.patch<ApiResponse<null>>(
            `/${prefix}/password`,
            payload
        );
    },

    // PATCH /accounts/change-password - Đổi mật khẩu
    changePassword(payload: any) {
        return http.patch<ApiResponse<null>>(
            `/${prefix}/change-password`,
            payload
        );
    },

    // DELETE /accounts/{accountId} - Xóa tài khoản
    delete(accountId: string) {
        return http.delete<ApiResponse<null>>(
            `/${prefix}/${accountId}`
        );
    },

    // PATCH /accounts/change-status/{accountId} - Thay đổi trạng thái 
    changeStatus(id: string, status: AccountStatus) {
        return http.patch<ApiResponse<Account>>(
            `/${prefix}/${id}/status`,
            { status } 
        );
    },
};