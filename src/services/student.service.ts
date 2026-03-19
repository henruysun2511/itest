import { ApiResponse } from "@/shares/types/body";
import { Student } from "@/shares/types/object";
import { StudentParam } from "@/shares/types/param";
import http from "@/shares/utils/http";

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