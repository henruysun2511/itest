import { ExamRegistrationService } from "@/services/examRegistration.service";
import { AccessStateBody, CreateExamRegistrationBody } from "@/shares/types/body";
import { ExamRegistrationParam } from "@/shares/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const REGISTRATION_QUERY_KEY = ["exam-registrations"];

export const useRegistrationList = (sessionId: string, param: ExamRegistrationParam) => {
  return useQuery({
    queryKey: [...REGISTRATION_QUERY_KEY, sessionId, param],
    queryFn: async () => {
      const res = await ExamRegistrationService.getList(sessionId, param);
      return res.data;
    },
    enabled: !!sessionId,
    placeholderData: (prev) => prev,
  });
};


export const useRegisterStudents = (sessionId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExamRegistrationBody[]) => 
      ExamRegistrationService.register(sessionId, data),
    onSuccess: () => {
      // Làm mới danh sách thí sinh của ca thi hiện tại
      qc.invalidateQueries({ queryKey: [...REGISTRATION_QUERY_KEY, sessionId] });
    },
  });
};

export const useUpdateAccessState = (sessionId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ registrationId, data }: { registrationId: string; data: AccessStateBody }) =>
      ExamRegistrationService.updateAccess(registrationId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...REGISTRATION_QUERY_KEY, sessionId] });
    },
  });
};

export const useRemoveRegistration = (sessionId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (studentId: string) => 
      ExamRegistrationService.remove(sessionId, studentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...REGISTRATION_QUERY_KEY, sessionId] });
    },
  });
};