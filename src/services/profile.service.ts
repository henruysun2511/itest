import { ApiResponse, UpdateProfileBody } from "@/types/body";
import { Profile } from "@/types/object";
import http from "@/utils/http";

const prefix = "profiles";

export const ProfileService = {
  // GET /profiles - Lấy thông tin cá nhân
  getProfile() {
    return http.get<ApiResponse<Profile>>(`/${prefix}`);
  },

  // PUT /profiles - Cập nhật thông tin cá nhân
  updateProfile(data: UpdateProfileBody) {
    return http.put<ApiResponse<Profile>>(`/${prefix}`, data);
  },
};