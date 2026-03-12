import { ExamService } from "@/services/exam.service";
import { ExamParam } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const EXAM_QUERY_KEY = ["exams"];

export const useExamByExamSet = (examSetId: string, params: ExamParam) => {
  return useQuery({
    queryKey: [...EXAM_QUERY_KEY, "exam-set", examSetId, params],
    queryFn: async () => {
      const res = await ExamService.getByExamSetId(examSetId, params);
      return res.data;
    },
    enabled: !!examSetId, 
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetExamPdf = () => {
  return useMutation({
    mutationFn: (examId: string) => ExamService.getPdfUrl(examId),
  });
};

// Hook tạo mới Exam
export const useCreateExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ExamService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAM_QUERY_KEY });
    },
  });
};

// Hook xóa Exam
export const useDeleteExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ExamService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAM_QUERY_KEY });
    },
  });
};

// Hook cập nhật Exam
export const useUpdateExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ExamService.update,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAM_QUERY_KEY });
    },
  });
};