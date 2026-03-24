import { ApiResponse, ExamBody } from "@/shares/types/body";
import { Exam, ExamPdf } from "@/shares/types/object";
import { ExamStatus } from "@/shares/constants/status.enum";
import { ExamParam } from "@/shares/types/param";
import http from "@/shares/utils/http";

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

  getDetail(examId: string) {
    return http.get<ApiResponse<Exam>>(`/${prefix}/${examId}/detail`);
  },

  // Duyệt đề thi
  approve(data: { id: string; status: ExamStatus }) {
    const { id, status } = data;
    return http.patch<ApiResponse<any>>(`/${prefix}/${id}`, { status });
  },
};