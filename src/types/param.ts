import { ExamSetSortBy, SortOrder } from './../constants/sort.enum';
interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}
export type { Pagination };

interface AccountParam extends Pagination { }

interface RoleParam extends Pagination {
  sort?: string;
}
interface ExamSetParam extends Pagination {
  search?: string;
  sortBy?: ExamSetSortBy;
  sortOrder?: SortOrder;
}
export type { AccountParam, ExamSetParam, RoleParam };

