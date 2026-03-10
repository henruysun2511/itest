import { ApiResponse, BulkAccountBody } from "@/types/body";
import { AccountStatus } from "@/types/enum";
import { Account } from "@/types/object";
import { AccountParam } from "@/types/param";
import http from "@/utils/http";

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

    // PATCH /accounts/update-password - Cập nhật mật khẩu
    updatePassword(payload: Partial<Account>) {
        return http.patch<ApiResponse<null>>(
            `/${prefix}/update-password`,
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
            `/${prefix}/change-status/${id}`,
            { status } 
        );
    },
};