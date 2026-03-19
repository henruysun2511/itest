import { ExamSessionHandlingService } from "@/services/examSessionHandling.service";
import { CreateProctoringHandleBody } from "@/shares/types/body";
import { ExamSessionHandlingParam } from "@/shares/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const HANDLING_KEY = ['EXAM_SESSION_HANDLING'];

// Hook lấy danh sách xử lý vi phạm
export const useExamSessionHandlingList = (params: ExamSessionHandlingParam) => {
  return useQuery({
    queryKey: [...HANDLING_KEY, params],
    queryFn: async () => {
      const res = await ExamSessionHandlingService.getList(params);
      return res.data;
    },
  });
};

// Hook tạo mới hành động xử lý (Cảnh báo, Đình chỉ...)
export const useCreateProctoringHandle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examAttemptId, data }: { examAttemptId: string, data: CreateProctoringHandleBody }) => 
      ExamSessionHandlingService.create(examAttemptId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HANDLING_KEY });
      queryClient.invalidateQueries({ queryKey: ['EXAM_ATTEMPT'] }); 
    }
  });
};