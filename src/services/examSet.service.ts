import { ApiResponse } from "@/types/body";
import { ExamSet } from "@/types/object";
import { ExamSetParam } from "@/types/param";
import http from "@/utils/http";

const prefix = "examsets";

export const ExamSetService = {
  // GET /exam-sets - Lấy toàn bộ danh sách exam sets
  getList() {
    return http.get<ApiResponse<ExamSet[]>>(
        `/${prefix}`);
  },

  // POST /exam-sets/filter - Lấy danh sách có phân trang + search
  getListPagination(data: ExamSetParam) {
    return http.post<ApiResponse<ExamSet[]>>(
        `/${prefix}/filter`, data);
  },

  // POST /exam-sets - Tạo exam set mới
  create(data: Partial<ExamSet>) {
    return http.post<ApiResponse<ExamSet>>(
        `/${prefix}`, data);
  },

  // DELETE /exam-sets/:id - Xóa exam set
  delete(id: string) {
    return http.delete<ApiResponse<ExamSet>>(
        `/${prefix}/${id}`);
  },

  // PUT /examsets/:id - Cập nhật exam set
  update(data: { id: string } & Partial<ExamSet>) {
    const { id, ...payload } = data;
    return http.put<ApiResponse<ExamSet>>(`
        /${prefix}/${id}`, payload);
  },
};