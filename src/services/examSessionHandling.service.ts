import { ApiResponse, CreateProctoringHandleBody } from "@/types/body";
import { ExamSessionHandling } from "@/types/object";
import { ExamSessionHandlingParam } from "@/types/param";
import http from "@/utils/http";

export const ExamSessionHandlingService = {
  getList: (params: ExamSessionHandlingParam) => {
    return http.get<ApiResponse<ExamSessionHandling[]>>(
      '/exam-session-handlings', 
      { params }
    );
  },

  // Tạo mới một xử lý vi phạm cho sinh viên
  create: (examAttemptId: string, data: CreateProctoringHandleBody) => {
    return http.post<ApiResponse<null>>(`/exam-session-handlings/${examAttemptId}`, data);
  }
};