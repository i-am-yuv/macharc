export interface Pagination {
    pageNo?: number;
    pageSize?: number;
    sortField?: string;
    sortDir?: string;
    totalElements?: number;
    offset?: number;
}