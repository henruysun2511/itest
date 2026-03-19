import { ApiResponse } from "@/types/body";
import { ExamSessionHandling } from "@/types/object";
import { ExamSessionHandlingParam } from "@/types/param";
import http from "@/utils/http";

const prefix = "exam-session-handlings"; 

export const ExamHandlingService = {
    getList(params: ExamSessionHandlingParam) {
        return http.get<ApiResponse<ExamSessionHandling[]>>(
            `/${prefix}`,
            { params }
        );
    },
};
