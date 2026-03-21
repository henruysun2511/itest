import { ApiResponse, AssignGradersBody, GradeEssayBody } from "@/shares/types/body";
import http from "@/shares/utils/http";

const prefix = "result-gradings";

export const ResultGradingService = {
  getByTeacherId() {
    return http.get<ApiResponse<any[]>>(`/${prefix}`);
  },

  getPublishedScoresByExamSessionCode(examSessionCode: string) {
    return http.get<ApiResponse<any[]>>(`/${prefix}/exam-sessions/${examSessionCode}/scores`);
  },

  assignGraders(data: AssignGradersBody) {
    return http.post<ApiResponse<any>>(`/${prefix}/assign`, data);
  },

  gradeEssay(data: GradeEssayBody) {
    return http.patch<ApiResponse<any>>(`/${prefix}/essay/grade`, data);
  }
};
