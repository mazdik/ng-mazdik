import {EventEmitter, PipeTransform} from '@angular/core';

export interface ISelectOption {
  id: any;
  name: string;
  parentId?: any;
}

export interface Column {
  title: string;
  name: string;
  sortable?: boolean;
  filter?: boolean;
  options?: ISelectOption[];
  pipe?: PipeTransform;
  width?: number;
  frozen?: boolean;
  type?: 'text' | 'password' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'date' | 'datetime-local' | 'select-popup';
  validation?: IValidation;
  editable?: boolean;
  resizeable?: boolean;
  dependsColumn?: string;
  cellTemplate?: any;
  formHidden?: boolean;
  tableHidden?: boolean;
  optionsUrl?: string;
  cellClass?: any;
  keyColumn?: string;
}

export interface FilterMetadata {
  value?: any;
  matchMode?: string;
}

export interface Filter {
  [s: string]: FilterMetadata;
}

export interface Settings {
  api: string;
  process?: string;
  crud: boolean;
  primaryKey?: any;
  type?: string;
  tableWidth?: number;
  scrollHeight?: number;
  sortable?: boolean;
  filter?: boolean;
  initLoad?: boolean;
  clientSide?: boolean;
}

export interface ICrudService {
  url: string;
  primaryKey: any;
  getItems(page: number, filters?: Filter, sortField?: string, sortOrder?: number): Promise<any>;
  getItem(id: number): Promise<any>;
  post(item: any): Promise<any>;
  put(item: any): Promise<any>;
  delete(item: any): Promise<any>;
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
