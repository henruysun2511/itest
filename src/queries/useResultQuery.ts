import { ResultService } from "@/services/result.service";
import { ApiResponse } from "@/types/body";
import { Result, ResultDetail } from "@/types/object";
import { ResultParam } from "@/types/param";
import { useQuery } from "@tanstack/react-query";

export const RESULT_QUERY_KEY = ["results"];

export const useResultList = (params: ResultParam) => {
    return useQuery<ApiResponse<Result[]>>({
        queryKey: [...RESULT_QUERY_KEY, params],
        queryFn: async () => {
            const res = await ResultService.search(params);
            return res.data;
        },
    });
};

export const useResultDetail = (id: string, enabled: boolean = true) => {
    return useQuery<ApiResponse<ResultDetail>>({
        queryKey: [...RESULT_QUERY_KEY, "detail", id],
        queryFn: async () => {
            const res = await ResultService.getDetail(id);
            return res.data;
        },
        enabled: enabled && !!id,
    });
};
