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
  | 'month'
  | 'select-popup'
  | 'select-dropdown';

export enum DataType {
  String = 'string',
  Number = 'number',
  Date = 'date',
}

export type AggregateType = 'sum' | 'average' | 'max' | 'min' | 'count';

export type SelectionMode = 'checkbox' | 'radio';

export enum ColumnResizeMode {
  Simple = 'simple',
  Aminated = 'aminated',
}

export enum EditMode {
  EditCellOnDblClick = 'editCellOnDblClick',
  EditProgrammatically = 'editProgrammatically',
}

export interface FilterMeta {
  value?: any;
  matchMode?: string;
  valueTo?: any;
  type?: DataType;
}

export interface FilterMetadata {
  [s: string]: FilterMeta;
}

export interface SortMetadata {
  field: string;
  order: number;
}

export interface AggregateMeta {
  field: string;
  type: AggregateType;
}

export interface GroupMeta {
  index: number;
  size: number;
}

export interface GroupMetaData {
  [s: string]: GroupMeta;
}

export interface Row {
  [name: string]: any;
  $$uid: number;
  $$index: number;
  $$data: Object;
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

export enum Keys {
  BACKSPACE = 8,
  TAB = 9,
  ENTER = 13,
  ESCAPE = 27,
  SPACE = 32,
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40,
  DELETE = 46,
  KEY_F2 = 113,
}
