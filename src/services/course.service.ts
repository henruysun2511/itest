import { ApiResponse } from "@/types/body";
import { Course } from "@/types/object";
import { CourseParam } from "@/types/param";
import http from "@/utils/http";

const prefix = "courses";

export const CourseService = {
  // GET: Lấy danh sách khóa học kèm phân trang và filter
  getList(params?: CourseParam) {
    return http.get<ApiResponse<Course[]>>(`/${prefix}`, { params });
  },
};