import { ResultService } from "@/services/result.service";
import { ApiResponse } from "@/types/body";
import { Result } from "@/types/object";
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
