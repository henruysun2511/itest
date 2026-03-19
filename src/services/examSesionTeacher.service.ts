import { ApiResponse, CreateExamSessionTeacherBody } from "@/shares/types/body";
import { ExamSessionTeacher } from "@/shares/types/object";
import http from "@/shares/utils/http";

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
