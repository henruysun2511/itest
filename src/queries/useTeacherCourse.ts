import { TeacherCourseService } from "@/services/teacherCourse.service";
import { useQuery } from "@tanstack/react-query";

export const TEACHER_COURSE_KEY = ["teacher-courses"];

export const useMyTeacherCourses = () => {
  return useQuery({
    queryKey: [...TEACHER_COURSE_KEY, "me"],
    queryFn: async () => {
      const response = await TeacherCourseService.getMyCourses();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, 
  });
};