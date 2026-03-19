import { ApiResponse, LoginBody, LoginResponse } from "@/shares/types/body";
import { refreshApi } from "@/shares/utils/axios";
import http from "@/shares/utils/http";

const authPrefix = "/auth";

export const authService = {
  login(data: LoginBody) {
    return http.post<ApiResponse<LoginResponse>>(`${authPrefix}/login`, data);
  },

  logout() {
    return http.post<ApiResponse<null>>(`${authPrefix}/logout`);
  },

  logoutDevices() {
    return http.delete<ApiResponse<null>>(`${authPrefix}/logout-devices`);
  },

  refreshToken() {
    return refreshApi.post(`${authPrefix}/refresh-token`);
  }
};