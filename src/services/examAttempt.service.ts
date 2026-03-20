import { ApiResponse, ForceSubmitBody, PauseAttemptBody, ReportFraudBody, RetakePermissionBody, SaveAnswersBody, SaveDraftBody, SubmitExamBody, VerifyFaceBody } from "@/shares/types/body";
import { ExamAttempt } from "@/shares/types/object";
import { ExamAttemptParam } from "@/shares/types/param";

import http from "@/shares/utils/http";

const prefix = "exam-attempts";

export const ExamAttemptService = {
  // GET: Lấy danh sách lượt thi của 1 ca thi (cho giám thị)
  getListBySession(examSessionId: string, params?: ExamAttemptParam) {
    return http.get<ApiResponse<ExamAttempt[]>>(
      `/${prefix}/exam-sessions/${examSessionId}`, { params }
    );
  },

  // GET: Lấy chi tiết lượt thi của chính tôi trong 1 ca thi
  getMyAttempt(examSessionId: string) {
    return http.get<ApiResponse<ExamAttempt>>(
      `/${prefix}/exam-sessions/${examSessionId}/me`
    );
  },

  // POST: Lưu đáp án (trigger từ sv)
  saveAnswers(examSessionId: string, data: SaveAnswersBody) {
    return http.post<ApiResponse<any>>(`/${prefix}/save-answers/${examSessionId}`, data);
  },

  // PATCH: Tạm dừng bài làm thí sinh cụ thể
  patchPauseState(examSessionId: string, studentId: string, data: PauseAttemptBody) {
    return http.patch<ApiResponse<any>>(`/${prefix}/${examSessionId}/${studentId}/pause-state`, data);
  },

  // POST: Thu bài cưỡng chế những thí sinh được chọn
  forceSubmitSelected(examSessionId: string, data: ForceSubmitBody) {
    return http.post<ApiResponse<any>>(`/${prefix}/${examSessionId}/force-submit/selected`, data);
  },

  // POST: Lưu nháp (Auto-save)
  saveDraft(data: SaveDraftBody) {
    return http.post<ApiResponse<any>>(`/${prefix}/draft`, data);
  },

  // POST: Nộp bài
  submit(examSessionId: string, data: SubmitExamBody) {
    return http.post<ApiResponse<any>>(`/${prefix}/${examSessionId}/submit`, data);
  },

  // PATCH: Cấp quyền thi lại
  grantRetake(data: RetakePermissionBody) {
    return http.patch<ApiResponse<any>>(`/${prefix}/retake-permission`, data);
  },

  // POST: Báo cáo vi phạm
  reportFraud(examAttemptId: string, data: ReportFraudBody) {
    return http.post<ApiResponse<any>>(`/${prefix}/${examAttemptId}/frauds`, data);
  },

  // POST: Heartbeat duy trì kết nối
  heartbeat(examAttemptId: string) {
    return http.post<ApiResponse<any>>(`/${prefix}/${examAttemptId}/heartbeat`);
  },

  // POST: Xác thực khuôn mặt ca thi
  verifyFace(data: VerifyFaceBody) {
    const formData = new FormData();
    formData.append('face', data.face); // data.face là đối tượng File
    formData.append('examAttemptId', data.examAttemptId);
    formData.append('occurredAt', data.occurredAt.toISOString());

    return http.post<ApiResponse<any>>(
      `/${prefix}/exam-sessions/verify-face`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }
};