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

export type { AccountParam, RoleParam };
