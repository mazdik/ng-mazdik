import {AggregateType} from './type';

export interface SelectOption {
  id: any;
  name: string;
  parentId?: any;
}

export interface FilterMetadata {
  value?: any;
  matchMode?: string;
  valueTo?: any;
  type?: string;
}

export interface Filter {
  [s: string]: FilterMetadata;
}

export interface DataSource {
  url: string;
  primaryKeys: string[];
  getItems(page: number, filters: Filter, sortMeta: SortMeta[], globalFilterValue?: string): Promise<any>;
  getItem(row: any): Promise<any>;
  post(row: any): Promise<any>;
  put(row: any): Promise<any>;
  delete(row: any): Promise<any>;
  getOptions?(url: string, parentId: any): Promise<any>;
}

export interface SortMeta {
  field: string;
  order: number;
}

export interface Validation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
}

export interface MenuItem {
  label?: string;
  icon?: string;
  command?: string;
  url?: string;
  routerLink?: any;
  disabled?: boolean;
}

export interface TreeNode {
  id: string;
  name: string;
  data: any;
  children?: TreeNode[];
  expanded?: boolean;
  leaf?: boolean;
  parent?: TreeNode;
  icon?: string;
  $$id?: string;
  $$filterState?: number;
  $$level?: number;
}

export interface TreeDataSource {
  url: string;
  getNodes(node?: TreeNode): Promise<TreeNode[]>;
  searchNodes(name: string): Promise<any>;
}

export  interface AggregateMeta {
  field: string;
  type: AggregateType;
}
