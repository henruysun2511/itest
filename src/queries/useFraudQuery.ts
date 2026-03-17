import { FraudService } from "@/services/fraud.service";
import { ApiResponse } from "@/types/body";
import { Fraud } from "@/types/object";
import { FraudParam } from "@/types/param";
import { useQuery } from "@tanstack/react-query";

export const FRAUD_QUERY_KEY = ["frauds"];

export const useFraudList = (params: FraudParam) => {
    return useQuery<ApiResponse<Fraud[]>>({
        queryKey: [...FRAUD_QUERY_KEY, params],
        queryFn: async () => {
            const res = await FraudService.getList(params);
            return res.data;
        },
    });
};
