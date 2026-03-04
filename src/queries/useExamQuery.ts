import { ExamService } from "@/services/exam.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const EXAM_QUERY_KEY = ["exams"];

// Hook lấy toàn bộ danh sách
export const useExamList = () => {
  return useQuery({
    queryKey: [...EXAM_QUERY_KEY],
    queryFn: async () => {
      const res = await ExamService.getList();
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// Hook phân trang và tìm kiếm
// export const useExamListPagination = (param: ExamParam) => {
//   return useQuery({
//     queryKey: [...EXAM_QUERY_KEY, param],
//     queryFn: async () => {
//       const res = await ExamService.getListPagination(param);
//       return res.data;
//     },
//     staleTime: 5 * 60 * 1000,
//   });
// };

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