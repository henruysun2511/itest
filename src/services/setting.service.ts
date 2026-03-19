import { ApiResponse } from "@/shares/types/body";
import { Setting } from "@/shares/types/object";
import http from "@/shares/utils/http";

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