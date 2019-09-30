import { FilterMetadata, SortMetadata } from '../../ng-data-table/base/types';

export interface DataSource {
  getItems(requestMeta: RequestMetadata): Promise<PagedResult>;
  getItem(row: any): Promise<any>;
  post(row: any): Promise<any>;
  put(row: any): Promise<any>;
  delete(row: any): Promise<any>;
  getOptions?(url: string, parentId: any): Promise<any>;
}

export class RequestMetadata {
  pageMeta: PageMetadata;
  sortMeta: SortMetadata[];
  filters: FilterMetadata;
  globalFilterValue?: string;
}

export class PagedResult {
  items: any[];
  _meta: PageMetadata;
}

export class PageMetadata {
  currentPage: number;
  perPage: number;
  totalCount?: number;
  pageCount?: number;
  maxRowCount?: number;
}
