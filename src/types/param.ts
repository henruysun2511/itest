interface Pagination {
  page?: number;
  size?: number;
  totalPages?: number;
  totalElements?: number;
}
export type { Pagination };

interface AccountParam extends Pagination {
}
export type { AccountParam };

