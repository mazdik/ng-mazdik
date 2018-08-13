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

export interface SortMeta {
  field: string;
  order: number;
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
  $$id?: number;
  $$filterState?: number;
  $$level?: number;
}

export interface TreeDataSource {
  url: string;
  getNodes(node?: TreeNode): Promise<TreeNode[]>;
  searchNodes(name: string): Promise<any>;
}

export interface AggregateMeta {
  field: string;
  type: AggregateType;
}

export interface Row {
  [name: string]: any;
  $$uid: number;
  $$index: number;
  $$data: Object;
  $$height: number;
  $$offset: number;
}

export interface Validation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
}
