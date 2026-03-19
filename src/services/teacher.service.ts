import { ApiResponse } from "@/shares/types/body";
import { Teacher } from "@/shares/types/object";
import http from "@/shares/utils/http";

const prefix = "teachers";

export const TeacherService = {
  // Lấy danh sách toàn bộ giảng viên
  getList() {
    return http.get<ApiResponse<Teacher[]>>(`/${prefix}`);
  },
};
