import { Filter, SortMeta, Row } from '../../ng-data-table';

export interface PagedResult {
  items: any[];
  _meta: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
  };
}

export interface DataSource {
  url: string;
  primaryKeys: string[];
  getItems(page: number, filters: Filter, sortMeta: SortMeta[], globalFilterValue?: string): Promise<PagedResult>;
  getItem(row: any): Promise<any>;
  post(row: any): Promise<any>;
  put(row: any): Promise<any>;
  delete(row: any): Promise<any>;
  getOptions?(url: string, parentId: any): Promise<any>;
}

export interface MenuItem {
  label?: string;
  icon?: string;
  command?: (event?: any) => void;
  url?: string;
  routerLink?: any;
  disabled?: boolean;
}

export interface RowMenuEventArgs {
  left: number;
  top: number;
  row: Row;
}
