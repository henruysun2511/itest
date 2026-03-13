import { ApiResponse } from "@/types/body";
import { Student } from "@/types/object";
import { StudentParam } from "@/types/param";
import http from "@/utils/http";

const prefix = "students";

export const StudentService = {
  // GET students với filter và phân trang
  getList(params: StudentParam) {
    return http.get<ApiResponse<Student[]>>(`/${prefix}`, { params });
  },

  // POST students/filter-invalid gửi mảng studentCode
  filterInvalid(studentCodes: string[]) {
    return http.post<ApiResponse<Student[]>>(`/${prefix}/filter-invalid`, { 
        studentCodes 
    });
  }
};