import { StudentService } from "@/services/student.service";
import { StudentParam } from "@/types/param";
import { useMutation, useQuery } from "@tanstack/react-query";

export const STUDENT_QUERY_KEY = ["students"];

export const useStudentList = (param: StudentParam) => {
  return useQuery({
    queryKey: [...STUDENT_QUERY_KEY, param],
    queryFn: async () => {
      const res = await StudentService.getList(param);
      return res.data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFilterInvalidStudents = () => {
  return useMutation({
    mutationFn: (studentCodes: string[]) => StudentService.filterInvalid(studentCodes),
    onSuccess: (res) => {
      return res.data;
    }
  });
};