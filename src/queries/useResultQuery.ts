import { ResultService } from "@/services/result.service";
import { ResultParam } from "@/shares/types/param";
import { useQuery } from "@tanstack/react-query";

export const RESULT_QUERY_KEY = ["results"];

export const useMyResultList = (params?: ResultParam) => {
    return useQuery({
        queryKey: [...RESULT_QUERY_KEY, "me", params],
        queryFn: async () => {
            const res = await ResultService.getMe(params);
            return res.data;
        },
    });
};

export const useResultList = (params: ResultParam) => {
    return useQuery({
        queryKey: [...RESULT_QUERY_KEY, params],
        queryFn: async () => {
            const res = await ResultService.search(params);
            return res.data;
        },
    });
};

export const useResultDetail = (id: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: [...RESULT_QUERY_KEY, "detail", id],
        queryFn: async () => {
            const res = await ResultService.getDetail(id);
            return res.data;
        },
        enabled: enabled && !!id,
    });
};

export const useEssayAnswers = (resultId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: [...RESULT_QUERY_KEY, "essay-grading", resultId],
        queryFn: async () => {
            const res = await ResultService.getEssayAnswers(resultId);
            return res.data;
        },
        enabled: enabled && !!resultId, 
    });
};
