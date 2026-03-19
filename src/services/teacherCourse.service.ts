import { ApiResponse } from "@/shares/types/body";
import { TeacherCourse } from "@/shares/types/object";
import http from "@/shares/utils/http";

const prefix = "teacher-courses";

export const TeacherCourseService = {
  // GET: /teacher-courses/me
  getMyCourses() {
    return http.get<ApiResponse<TeacherCourse[]>>(`/${prefix}/me`);
  }
};