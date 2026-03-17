import { ExamSessionStatus } from '@/constants/status.enum';
import { ExamRegistrationStatusType, GenderType } from '@/constants/type.enum';
import { BaseSortBy, ExamSessionSortBy, ExamSetSortBy, ExamSortBy, SortOrder } from './../constants/sort.enum';
import { AccountType } from './enum';
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

export type { AccountParam, ExamParam, ExamRegistrationParam, ExamSessionParam, ExamSetParam, RoleParam, StudentParam, FraudParam };
