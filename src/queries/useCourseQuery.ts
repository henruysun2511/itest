import { CourseService } from "@/services/course.service";
import { CourseParam } from "@/types/param";
import { useQuery } from "@tanstack/react-query";

export const COURSE_KEY = ["courses"];

export const useCourseList = (params?: CourseParam) => {
  return useQuery({
    queryKey: [...COURSE_KEY, "list", params],
    queryFn: async () => {
      const response = await CourseService.getList(params);
      return response.data; 
    },
    placeholderData: (previousData) => previousData,
  });
};