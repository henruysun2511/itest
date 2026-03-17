import { ExamAttemptService } from "@/services/examAttempt.service";
import {
    ForceSubmitBody,
    PauseAttemptBody,
    ReportFraudBody,
    SubmitExamBody
} from "@/types/body";
import { ExamAttemptParam } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const EXAM_ATTEMPT_KEY = ["exam-attempts"];

export const useExamAttemptList = (examSessionId: string, params?: ExamAttemptParam) => {
  return useQuery({
    queryKey: [...EXAM_ATTEMPT_KEY, "session", examSessionId, params],
    queryFn: () => ExamAttemptService.getListBySession(examSessionId, params),
    enabled: !!examSessionId,
    refetchInterval: 10000, 
  });
};

// Hook tạm dừng thí sinh
export const usePauseStudentAttempt = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ examSessionId, studentId, data }: { examSessionId: string, studentId: string, data: PauseAttemptBody }) =>
      ExamAttemptService.patchPauseState(examSessionId, studentId, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: [...EXAM_ATTEMPT_KEY, "session", variables.examSessionId] });
    }
  });
};

// Hook thu bài cưỡng chế
export const useForceSubmitSelected = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ examSessionId, data }: { examSessionId: string, data: ForceSubmitBody }) =>
      ExamAttemptService.forceSubmitSelected(examSessionId, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: [...EXAM_ATTEMPT_KEY, "session", variables.examSessionId] });
    }
  });
};

// Hook nộp bài (Sinh viên)
export const useSubmitExam = () => {
  return useMutation({
    mutationFn: ({ examSessionId, data }: { examSessionId: string, data: SubmitExamBody }) =>
      ExamAttemptService.submit(examSessionId, data),
  });
};

// Hook lưu nháp (Auto-save)
export const useSaveDraft = () => {
  return useMutation({
    mutationFn: ExamAttemptService.saveDraft,
  });
};

// Hook cấp quyền thi lại
export const useGrantRetake = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ExamAttemptService.grantRetake,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAM_ATTEMPT_KEY });
    }
  });
};

// Hook báo cáo vi phạm
export const useReportFraud = () => {
  return useMutation({
    mutationFn: ({ examAttemptId, data }: { examAttemptId: string, data: ReportFraudBody }) =>
      ExamAttemptService.reportFraud(examAttemptId, data),
  });
};

// Hook verify face
export const useVerifyFaceAttempt = () => {
  return useMutation({
    mutationFn: ExamAttemptService.verifyFace,
  });
};