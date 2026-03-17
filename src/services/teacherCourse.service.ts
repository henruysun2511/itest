import { ApiResponse } from "@/types/body";
import { TeacherCourse } from "@/types/object";
import http from "@/utils/http";

const prefix = "teacher-courses";

export const TeacherCourseService = {
  // GET: /teacher-courses/me
  getMyCourses() {
    return http.get<ApiResponse<TeacherCourse[]>>(`/${prefix}/me`);
  }
};