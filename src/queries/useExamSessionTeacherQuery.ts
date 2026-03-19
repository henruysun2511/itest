import { ExamTeacherService } from "@/services/examSesionTeacher.service";
import { CreateExamSessionTeacherBody } from "@/shares/types/body";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const EXAM_TEACHER_QUERY_KEY = ["examTeachers"];

// Hook lấy danh sách giám thị của ca thi
export const useExamTeacherList = (examSessionId: string) => {
    return useQuery({
        queryKey: [...EXAM_TEACHER_QUERY_KEY, examSessionId],
        queryFn: async () => {
            const res = await ExamTeacherService.getList(examSessionId);
            return res.data;
        },
        enabled: !!examSessionId,
    });
};

// Hook thêm giám thị vào ca thi
export const useCreateExamTeacher = (examSessionId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateExamSessionTeacherBody) =>
            ExamTeacherService.create(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [...EXAM_TEACHER_QUERY_KEY, examSessionId] });
        },
    });
};

// Hook xóa giám thị khỏi ca thi
export const useRemoveExamTeacher = (examSessionId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (examSessionTeacherId: string) =>
            ExamTeacherService.delete(examSessionTeacherId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [...EXAM_TEACHER_QUERY_KEY, examSessionId] });
        },
    });
};
