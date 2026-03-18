import { ApiResponse } from "@/types/body";
import { Result } from "@/types/object";
import { ResultParam } from "@/types/param";
import http from "@/utils/http";

const prefix = "results"; 

export const ResultService = {
    search(params: ResultParam) {
        return http.get<ApiResponse<Result[]>>(
            `/${prefix}/search`,
            { params }
        );
    },
};
