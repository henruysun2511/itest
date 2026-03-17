import { ApiResponse } from "@/types/body";
import { Fraud } from "@/types/object";
import { FraudParam } from "@/types/param";
import http from "@/utils/http";

const prefix = "fraud-details"; 

export const FraudService = {
    getList(params: FraudParam) {
        return http.get<ApiResponse<Fraud[]>>(
            `/${prefix}`,
            { params }
        );
    },
};
