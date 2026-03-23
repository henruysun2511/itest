import { ResultGradingService } from "@/services/resultGrading.service";
import { AssignGradersBody, GradeEssayBody, ReassignGraderBody } from "@/shares/types/body";
import { ResultGradingParam } from "@/shares/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const RESULT_GRADING_KEY = ["result-gradings"];

export const useResultGradingListByTeacher = (params?: ResultGradingParam) => {
  return useQuery({
    queryKey: [...RESULT_GRADING_KEY, "teacher", params],
    queryFn: async () => {
      const res = await ResultGradingService.getByTeacherId(params);
      return res.data;
    },
  });
};

export const useMyResultGradings = () => {
  return useQuery({
    queryKey: [...RESULT_GRADING_KEY, "my-gradings"],
    queryFn: async () => {
      const res = await ResultGradingService.getMyResultGradings();
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

export const useReassignGrader = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ReassignGraderBody) => ResultGradingService.reassign(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RESULT_GRADING_KEY });
    },
  });
};
