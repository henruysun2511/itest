import { ApiResponse } from "@/shares/types/body";
import { FraudDetail } from "@/shares/types/object";
import { FraudDetailParam } from "@/shares/types/param";
import http from "@/shares/utils/http";

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