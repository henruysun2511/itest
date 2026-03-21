import { ApiResponse } from "@/shares/types/body";
import { EssayResult, Result, ResultDetail } from '@/shares/types/object';
import { ResultParam } from "@/shares/types/param";
import http from '@/shares/utils/http';

const prefix = "results";

export const ResultService = {
    search(params: ResultParam) {
        return http.get<ApiResponse<Result[]>>(
            `/${prefix}/search`,
            { params }
        );
    },
    getDetail(id: string) {
        return http.get<ApiResponse<ResultDetail>>(`/${prefix}/${id}`);
    },

    getMe(params?: ResultParam) {
        return http.get<ApiResponse<Result[]>>(`/${prefix}/me`, { params });
    },

    getEssayAnswers(resultId: string) {
        return http.get<ApiResponse<EssayResult>>(`/${prefix}/${resultId}/essay-answers/grading`);
    },
};
