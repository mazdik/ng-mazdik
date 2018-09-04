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

export type AggregateType = 'sum' | 'average' | 'max' | 'min' | 'count';

export type SelectionMode = 'checkbox' | 'radio';

export type ColumnResizeMode = 'simple' | 'aminated';

export type EditMode = 'editCellOnDblClick' | 'editProgrammatically';

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

export interface SortMetadata {
  field: string;
  order: number;
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

export interface ColumnMenuEventArgs {
  left: number;
  top: number;
  column: any;
}

export interface CellEventArgs {
  columnIndex: number;
  rowIndex: number;
  event?: any;
  fromCell?: HTMLElement;
  editMode?: boolean;
}
