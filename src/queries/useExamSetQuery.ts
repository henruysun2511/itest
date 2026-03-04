import { ExamSetService } from "@/services/examSet.service";
import { ExamSetParam } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const EXAMSET_QUERY_KEY = ["examsets"];

export const useExamSetList = () => {
  return useQuery({
    queryKey: [...EXAMSET_QUERY_KEY],
    queryFn: async () => {
      const res = await ExamSetService.getList();
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

// phân trang và tìm kiếm exam sets
export const useExamSetListPagination = (param: ExamSetParam) => {
  return useQuery({
    queryKey: [...EXAMSET_QUERY_KEY, param],
    queryFn: async () => {
      const res = await ExamSetService.getListPagination(param);
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

// create exam set
export const useExamSetCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ExamSetService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAMSET_QUERY_KEY });
    },
  });
};

// delete exam set
export const useExamSetDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ExamSetService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAMSET_QUERY_KEY });
    },
  });
};

// update exam set
export const useExamSetUpdate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ExamSetService.update,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAMSET_QUERY_KEY });
    },
  });
};