interface Pagination {
  page?: number;
  size?: number;
  totalPages?: number;
  totalElements?: number;
}
export type { Pagination };

interface AccountParam extends Pagination {}

interface RoleParam extends Pagination {
  sort?: string;
}
interface ExamSetParam extends Pagination {
  search?: string;
}
export type { AccountParam, RoleParam, ExamSetParam };
