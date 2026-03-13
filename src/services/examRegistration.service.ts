import { AccessStateBody, ApiResponse, CreateExamRegistrationBody } from "@/types/body";
import { ExamRegistration } from "@/types/object";
import { ExamRegistrationParam } from "@/types/param";
import http from "@/utils/http";

const prefix = "exam-registrations";

export const ExamRegistrationService = {
  // GET: Lấy danh sách thí sinh trong ca thi
  getList(sessionId: string, params: ExamRegistrationParam) {
    return http.get<ApiResponse<ExamRegistration[]>>(
      `/${prefix}/${sessionId}`, 
      { params }
    );
  },

  // POST: Đăng ký sinh viên vào ca thi (lẻ hoặc bulk)
  register(sessionId: string, data: CreateExamRegistrationBody[]) {
    return http.post<ApiResponse<ExamRegistration[]>>(
      `/${prefix}/${sessionId}`, 
      data
    );
  },

  // PATCH: Cập nhật quyền vào thi (Mở/Khóa)
  updateAccess(sessionId: string, data: AccessStateBody) {
    return http.patch<ApiResponse<ExamRegistration>>(
      `/${prefix}/access-state/${sessionId}`, 
      data
    );
  },

  // DELETE: Xóa sinh viên khỏi ca thi
  remove(sessionId: string, studentId: string) {
    return http.delete<ApiResponse<any>>(
      `/${prefix}/${sessionId}/students/${studentId}`
    );
  }
};