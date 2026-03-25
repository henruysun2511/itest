import { ExamSessionService } from "@/services/examSession.service";
import { ExamSessionStatus } from "@/shares/constants/status.enum";
import { ExamSessionParam, TeacherExamSessionParam } from "@/shares/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EXAM_ATTEMPT_KEY } from "./useExamAttemptQuery";

export const EXAM_SESSION_QUERY_KEY = ["exam-sessions"];
export const MY_EXAM_SESSION_QUERY_KEY = ["exam-sessions", "my-sessions"];

// Lấy danh sách ca thi
export const useExamSessionList = (param: ExamSessionParam) => {
  return useQuery({
    queryKey: [...EXAM_SESSION_QUERY_KEY, param],
    queryFn: async () => {
      const res = await ExamSessionService.getList(param);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useExamSessionDetail = (id: string) => {
  return useQuery({
    queryKey: [...EXAM_SESSION_QUERY_KEY, "detail", id],
    queryFn: async () => {
      const res = await ExamSessionService.getDetail(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  });
};

export const useMyExamSessions = (param?: ExamSessionParam, options?: any) => {
  return useQuery<any, Error>({
    queryKey: [...MY_EXAM_SESSION_QUERY_KEY, param],
    queryFn: async () => {
      const res = await ExamSessionService.getMySessions(param);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useTeacherExamSessions = (params: TeacherExamSessionParam) => {
  return useQuery({
    queryKey: [...EXAM_SESSION_QUERY_KEY, "teacher-sessions", params],
    queryFn: async () => {
      const res = await ExamSessionService.getTeacherSessions(params);
      return res.data;
    },
    enabled: !!params.courseId,
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000,
  });
};

// Tạo mới 1 ca thi
export const useExamSessionCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ExamSessionService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAM_SESSION_QUERY_KEY });
    },
  });
};

// Tạo nhiều ca thi (Bulk)
export const useExamSessionCreateMany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ExamSessionService.createMany,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAM_SESSION_QUERY_KEY });
    },
  });
};

// Thay đổi trạng thái (IN_PROGRESS, FINISHED,...)
export const useExamSessionChangeStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: ExamSessionStatus } }) =>
      ExamSessionService.changeStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAM_SESSION_QUERY_KEY });
    },
  });
};

// Khóa/Mở khóa ca thi
export const useExamSessionLock = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isLocked }: { id: string; isLocked: boolean }) =>
      ExamSessionService.setLockState(id, { isLocked }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAM_SESSION_QUERY_KEY });
    },
  });
};

// Tạm dừng/Tiếp tục ca thi
export const useExamSessionPause = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPaused }: { id: string; isPaused: boolean }) =>
      ExamSessionService.setPauseState(id, { isPaused }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAM_SESSION_QUERY_KEY });
      qc.invalidateQueries({ queryKey: EXAM_ATTEMPT_KEY });
    },
  });
};

export const useExamSessionClose = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ExamSessionService.close(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAM_SESSION_QUERY_KEY });
    },
  });
};

// Vào phòng thi (Join)
export const useExamSessionJoin = () => {
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file?: File }) =>
      ExamSessionService.join(id, file),
  });
};