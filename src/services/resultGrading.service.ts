import { ApiResponse, AssignGradersBody, GradeEssayBody, ReassignGraderBody } from "@/shares/types/body";
import { ResultGrading } from "@/shares/types/object";
import { ResultGradingParam } from "@/shares/types/param";
import http from "@/shares/utils/http";

const prefix = "result-gradings";

export const ResultGradingService = {
  getByTeacherId(params?: ResultGradingParam) {
    return http.get<ApiResponse<ResultGrading[]>>(`/${prefix}`, { params });
  },

  getMyResultGradings() {
    return http.get<ApiResponse<ResultGrading[]>>(`/${prefix}/me`);
  },

  getPublishedScoresByExamSessionCode(examSessionCode: string) {
    return http.get<ApiResponse<any[]>>(`/${prefix}/exam-sessions/${examSessionCode}/scores`);
  },

  assignGraders(data: AssignGradersBody) {
    return http.post<ApiResponse<any>>(`/${prefix}/assign`, data);
  },

  gradeEssay(data: GradeEssayBody) {
    return http.patch<ApiResponse<any>>(`/${prefix}/essay/grade`, data);
  },

  reassign(data: ReassignGraderBody) {
    return http.patch<ApiResponse<any>>(`/${prefix}/reassign`, data);
  }
};
