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
};