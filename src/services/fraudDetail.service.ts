import { ApiResponse } from "@/types/body";
import { FraudDetail } from "@/types/object";
import { FraudDetailParam } from "@/types/param";
import http from "@/utils/http";

const prefix = "fraud-details";

export const FraudDetailService = {
    // GET: Lấy danh sách lịch sử vi phạm 
    getList(params?: FraudDetailParam) {
        return http.get<ApiResponse<FraudDetail[]>>(`/${prefix}`, { params });
    },

    // GET: Lấy chi tiết một bản ghi vi phạm
    getDetail(fraudDetailId: string) {
        return http.get<ApiResponse<FraudDetail>>(`/${prefix}/${fraudDetailId}`);
    }
};