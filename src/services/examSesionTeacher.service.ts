import { ApiResponse, CreateExamSessionTeacherBody } from "@/types/body";
import { ExamSessionTeacher } from "@/types/object";
import http from "@/utils/http";

const prefix = "exam-session-teachers";

export const ExamTeacherService = {
  // Lấy danh sách giám thị của ca thi
  getList(examSessionId: string) {
    return http.get<ApiResponse<ExamSessionTeacher[]>>(`/${prefix}/${examSessionId}`);
  },

  // Thêm mới giám thị
  create(payload: CreateExamSessionTeacherBody) {
    return http.post<ApiResponse<ExamSessionTeacher>>(`/${prefix}`, payload);
  },

  // Xóa giám thị khỏi ca thi
  delete(examSessionTeacherId: string) {
    return http.delete<ApiResponse<null>>(`/${prefix}/${examSessionTeacherId}`);
  },
};
