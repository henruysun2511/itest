import { ApiResponse, ExamBody } from "@/types/body";
import http from "@/utils/http";

const prefix = "exams";

export const ExamService = {
  // Lấy toàn bộ danh sách exams
  getList() {
    return http.get<ApiResponse<any>>(`/${prefix}`);
  },

  // Lấy danh sách có phân trang và tìm kiếm
//   getListPagination(params: ExamParam) {
//     return http.post<ApiResponse<Exam[]>>(`/${prefix}/search`, params);
//   },

  // Tạo exam mới
  create(data: ExamBody) {
    return http.post<ApiResponse<any>>(`/${prefix}`, data);
  },

  // Xóa exam
  delete(id: string) {
    return http.delete<ApiResponse<any>>(`/${prefix}/${id}`);
  },

  // Cập nhật exam
  update(data: { id: string } & ExamBody) {
    const { id, ...payload } = data;
    return http.put<ApiResponse<any>>(`/${prefix}/${id}`, payload);
  },
  
  // Lấy chi tiết 1 exam (bổ sung thêm)
//   getById(id: string) {
//     return http.get<ApiResponse<Exam>>(`/${prefix}/${id}`);
//   }
};