export interface Pagination {
    page: number;
    limit: number;
    filter: Filters;
}

export interface Filters{
    sort: string;
    order: string;
    search: string;
    filter: Record<string, string>;
}



export type FilterWithoutSearch = Omit<Filters, 'search'>;
