import { ApiResponse } from "@/shares/types/body";
import { Course } from "@/shares/types/object";
import { CourseParam } from "@/shares/types/param";
import http from "@/shares/utils/http";

const prefix = "courses";

export const CourseService = {
  // GET: Lấy danh sách khóa học kèm phân trang và filter
  getList(params?: CourseParam) {
    return http.get<ApiResponse<Course[]>>(`/${prefix}`, { params });
  },
};