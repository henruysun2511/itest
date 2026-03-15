import { ApiResponse } from "@/types/body";
import { Setting } from "@/types/object";
import http from "@/utils/http";

const prefix = "settings";

export const SettingService = {
    // GET /settings
    getSettings() {
        return http.get<ApiResponse<Setting>>(`/${prefix}`);
    },

    // PATCH /settings
    updateSettings(data: Partial<Setting>) {
        return http.patch<ApiResponse<Setting>>(`/${prefix}`, data);
    },
};