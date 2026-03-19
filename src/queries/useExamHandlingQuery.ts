import { ExamHandlingService } from "@/services/exam-handling.service";
import { ApiResponse } from "@/types/body";
import { ExamSessionHandling } from "@/types/object";
import { ExamSessionHandlingParam } from "@/types/param";
import { useQuery } from "@tanstack/react-query";

export const EXAM_HANDLING_QUERY_KEY = ["exam-handlings"];

export const useExamHandlingList = (params: ExamSessionHandlingParam) => {
    return useQuery<ApiResponse<ExamSessionHandling[]>>({
        queryKey: [...EXAM_HANDLING_QUERY_KEY, params],
        queryFn: async () => {
            const res = await ExamHandlingService.getList(params);
            return res.data;
        },
    });
};
