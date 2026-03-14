import { TeacherService } from "@/services/teacher.service";
import { useQuery } from "@tanstack/react-query";

export const TEACHER_QUERY_KEY = ["teachers"];

// Hook lấy danh sách toàn bộ giảng viên
export const useTeacherList = () => {
    return useQuery({
        queryKey: TEACHER_QUERY_KEY,
        queryFn: async () => {
            const res = await TeacherService.getList();
            return res.data;
        },
    });
};
