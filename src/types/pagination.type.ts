export interface IPagination {
  page?: number;
  limit?: number;
}

export interface IPaginationData {
  currentPage: number;
  totalPage: number;
  limit: number;
  totalItems: number;
}
export interface IPaginationResponse<T> {
  paginationData: IPaginationData;
  items: T[];
}
