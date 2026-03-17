import { ApiResponse, ChangeExamSessionStatusBody, CreateExamSessionBody, LockStateBody, SetPauseStateBody } from "@/types/body";
import { ExamSession } from "@/types/object";
import { ExamSessionParam, TeacherExamSessionParam } from "@/types/param";
import http from "@/utils/http";

const prefix = "exam-sessions";

export const ExamSessionService = {
  getList(params: ExamSessionParam) {
    return http.get<ApiResponse<ExamSession[]>>(`/${prefix}`, { params });
  },

  getMySessions(params?: ExamSessionParam) {
    return http.get<ApiResponse<ExamSession[]>>(`/${prefix}/my-sessions`, { params });
  },

  // GET: /exam-sessions/teacher-sessions
  getTeacherSessions(params: TeacherExamSessionParam) {
    return http.get<ApiResponse<ExamSession[]>>(`/${prefix}/teacher-sessions`, { 
      params 
    });
  },

  getDetail(id: string) {
    return http.get<ApiResponse<ExamSession>>(`/${prefix}/${id}`);
  },

  create(data: CreateExamSessionBody) {
    return http.post<ApiResponse<ExamSession>>(`/${prefix}`, data);
  },

  createMany(data: CreateExamSessionBody[]) {
    return http.post<ApiResponse<ExamSession[]>>(`/${prefix}/bulk`, data);
  },

  changeStatus(id: string, data: ChangeExamSessionStatusBody) {
    return http.patch<ApiResponse<any>>(`/${prefix}/${id}/status`, data);
  },

  close(id: string) {
    return http.post<ApiResponse<any>>(`/${prefix}/${id}/close`);
  },

  join(id: string, faceFile?: File) {
    const formData = new FormData();
    if (faceFile) formData.append('face', faceFile);
    console.log(faceFile)

    return http.post<ApiResponse<any>>(`/${prefix}/${id}/join`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  setLockState(id: string, data: LockStateBody) {
    return http.patch<ApiResponse<any>>(`/${prefix}/${id}/lock-state`, data);
  },

  setPauseState(id: string, data: SetPauseStateBody) {
    return http.patch<ApiResponse<any>>(`/${prefix}/${id}/pause-state`, data);
  }
};