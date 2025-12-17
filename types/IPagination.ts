export type PaginationMeta = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};