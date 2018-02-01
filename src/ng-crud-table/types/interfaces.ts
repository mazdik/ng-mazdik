import {EventEmitter} from '@angular/core';

export interface ISelectOption {
  id: any;
  name: string;
  parentId?: any;
}

export type ColumnType =
  'text'
  | 'password'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'date'
  | 'datetime-local'
  | 'select-popup';

export interface FilterMetadata {
  value?: any;
  matchMode?: string;
  valueTo?: any;
  type?: string;
}

export interface Filter {
  [s: string]: FilterMetadata;
}

export interface ICrudService {
  url: string;
  primaryKeys: string[];
  getItems(page: number, filters?: Filter, sortField?: string, sortOrder?: number): Promise<any>;
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

export interface IValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
}

export interface MenuItem {
  label?: string;
  icon?: string;
  command?: (event?: any) => void;
  url?: string;
  routerLink?: any;
  eventEmitter?: EventEmitter<any>;
  disabled?: boolean;
}

export interface ITreeNode {
  id: string;
  name: string;
  data: any;
  children?: ITreeNode[];
  expanded?: boolean;
  leaf?: boolean;
  parent?: ITreeNode;
  icon?: string;
  $$id?: string;
  $$filterState?: number;
  $$level?: number;
}

export interface ITreeService {
  url: string;
  getNodes(node?: ITreeNode): Promise<ITreeNode[]>;
  searchNodes(name: string): Promise<any>;
}
