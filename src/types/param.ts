import { ExamSessionStatus } from '@/constants/status.enum';
import { ExamRegistrationStatusType, GenderType } from '@/constants/type.enum';
import { BaseSortBy, CourseSortBy, ExamSessionSortBy, ExamSetSortBy, ExamSortBy, SortOrder } from './../constants/sort.enum';
import { AccountType, ExamAttemptStatus, FraudLevel } from './enum';
interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}
export type { Pagination };

interface AccountParam extends Pagination {
  sortBy?: BaseSortBy;
  sortOrder?: SortOrder;
  type?: AccountType;
  roleName?: string;
  search?: string;
}

interface RoleParam extends Pagination {
  sort?: string;
}

interface ExamSetParam extends Pagination {
  search?: string;
  sortBy?: ExamSetSortBy;
  sortOrder?: SortOrder;
}

interface ExamParam extends Pagination {
  search?: string;
  sortBy?: ExamSortBy;
  sortOrder?: SortOrder;
  examSetId: string;
}

interface ExamSessionParam extends Pagination {
  examSessionCode?: string;
  date?: string;
  status?: ExamSessionStatus;
  sortOrder?: SortOrder;
  sortBy?: ExamSessionSortBy;
  search?: string;
}

interface StudentParam extends Pagination {
  search?: string;
  sortOrder?: SortOrder;
  gender?: GenderType;
}

interface ExamRegistrationParam extends Pagination {
  search?: string;
  sortOrder?: SortOrder;
  status?: ExamRegistrationStatusType;
}

interface FraudParam extends Pagination {
  examSessionId?: string;
  studentCode?: string;
}

interface ExamAttemptParam extends Pagination {
  status?: ExamAttemptStatus;
  fraudLevel?: FraudLevel;
  search?: string;
}

interface CourseParam extends Pagination {
  search?: string;
  sortOrder?: SortOrder;
  sortBy?: CourseSortBy;
}

interface TeacherExamSessionParam extends Pagination{
  courseId: string; 
  examSessionCode?: string;
  date?: string;
  status?: string;
  sortBy?: ExamSessionSortBy;
  sortOrder?: SortOrder;
}


export type {
  AccountParam, CourseParam, ExamAttemptParam, ExamParam, ExamRegistrationParam, ExamSessionParam,
  ExamSetParam, RoleParam,TeacherExamSessionParam, StudentParam, FraudParam
};

