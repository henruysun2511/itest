import { ResultGradingService } from "@/services/resultGrading.service";
import { AssignGradersBody, GradeEssayBody } from "@/shares/types/body";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const RESULT_GRADING_KEY = ["result-gradings"];

export const useResultGradingListByTeacher = () => {
  return useQuery({
    queryKey: [...RESULT_GRADING_KEY, "teacher"],
    queryFn: async () => {
      const res = await ResultGradingService.getByTeacherId();
      return res.data;
    },
  });
};

export const usePublishedScoresBySession = (examSessionCode: string) => {
  return useQuery({
    queryKey: [...RESULT_GRADING_KEY, "session-scores", examSessionCode],
    queryFn: async () => {
      const res = await ResultGradingService.getPublishedScoresByExamSessionCode(examSessionCode);
      return res.data;
    },
    enabled: !!examSessionCode,
  });
};

export const useAssignGraders = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignGradersBody) => ResultGradingService.assignGraders(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RESULT_GRADING_KEY });
    },
  });
};

export const useGradeEssay = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GradeEssayBody) => ResultGradingService.gradeEssay(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RESULT_GRADING_KEY });
    },
  });
};
