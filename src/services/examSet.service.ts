import { ApiResponse } from "@/shares/types/body";
import { ExamSet } from "@/shares/types/object";
import { ExamSetParam } from "@/shares/types/param";
import http from "@/shares/utils/http";

const prefix = "exam-sets";

export const ExamSetService = {
  getList(params: ExamSetParam) {
    return http.get<ApiResponse<ExamSet[]>>(
      `/${prefix}`, { params });
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