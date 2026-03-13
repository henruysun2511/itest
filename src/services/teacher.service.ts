import { ApiResponse } from "@/types/body";
import { Teacher } from "@/types/object";
import http from "@/utils/http";

const prefix = "teachers";

export const TeacherService = {
  // Lấy danh sách toàn bộ giảng viên
  getList() {
    return http.get<ApiResponse<Teacher[]>>(`/${prefix}`);
  },
};
