import { ApiResponse, CreateProctoringHandleBody } from "@/shares/types/body";
import { ExamSessionHandling } from "@/shares/types/object";
import { ExamSessionHandlingParam } from "@/shares/types/param";
import http from "@/shares/utils/http";

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