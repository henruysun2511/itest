import { ApiResponse, ExamBody } from "@/types/body";
import { Exam, ExamPdf } from "@/types/object";
import { ExamParam } from "@/types/param";
import http from "@/utils/http";

const prefix = "exams";

export const ExamService = {
  // Lấy Exams theo ExamSet ID
  getByExamSetId(examSetId: string, params: ExamParam) {
    const { examSetId: _, ...restParams } = params || {};

    return http.get<ApiResponse<Exam[]>>(
      `/${prefix}/exam-set/${examSetId}`,
      { params: restParams }
    );
  },

  // Lấy URL PDF của Exam
  getPdfUrl(examId: string) {
    return http.get<ApiResponse<ExamPdf>>(`/${prefix}/${examId}/pdf`);
  },

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