import { ApiResponse } from "@/types/body";
import { Role } from "@/types/object";
import http from "@/utils/http";


const prefix = "roles";

export const RoleService = {
    // GET /roles - Lấy toàn bộ danh sách roles
    getList() {
        return http.get<ApiResponse<Role[]>>(
            `/${prefix}`
        );
    },
    // post /roles - Tạo role mới
    create(data: Partial<Role>) {
        return http.post<ApiResponse<Role>>(
            `/${prefix}`,
            data
        );
    },
    // delete /roles/:id - Xóa role
    delete(id: string) {
        return http.delete<ApiResponse<Role>>(
            `/${prefix}/${id}`
        );
    },
};