import { FraudDetailService } from "@/services/fraudDetail.service";
import { FraudDetailParam } from "@/types/param";
import { useQuery } from "@tanstack/react-query";

export const FRAUD_DETAIL_KEY = ["fraud-details"];

// Hook lấy danh sách vi phạm
export const useFraudDetailList = (params?: FraudDetailParam) => {
    return useQuery({
        queryKey: [...FRAUD_DETAIL_KEY, "list", params],
        queryFn: async () => {
            const res = await FraudDetailService.getList(params);
            return res.data;
        },
    });
};

// Hook lấy chi tiết một bản ghi vi phạm
export const useFraudDetail = (fraudDetailId: string) => {
    return useQuery({
        queryKey: [...FRAUD_DETAIL_KEY, "detail", fraudDetailId],
        queryFn: async () => {
            const res = await FraudDetailService.getDetail(fraudDetailId);
            return res.data;
        },
        enabled: !!fraudDetailId, // Chỉ chạy khi có ID
    });
};