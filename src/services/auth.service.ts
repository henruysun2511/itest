import { ApiResponse, LoginBody, LoginResponse } from "@/types/body";
import { refreshApi } from "@/utils/axios";
import http from "@/utils/http";

const authPrefix = "/auth";

export const authService = {
  login(data: LoginBody) {
    return http.post<ApiResponse<LoginResponse>>(`${authPrefix}/login`, data);
  },

  logout() {
    return http.delete<ApiResponse<null>>(`${authPrefix}/logout-devices`);
  },

  refreshToken() {
    return refreshApi.post(`${authPrefix}/refresh-token`);
  }
};