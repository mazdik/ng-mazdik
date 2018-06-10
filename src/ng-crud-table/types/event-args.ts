import {Column} from '../base/column';
import {Row} from './interface';

export interface ColumnMenuEventArgs {
  left: number;
  top: number;
  right: number;
  bottom: number;
  column: Column;
}

export interface HoverEventArgs {
  columnName: string;
  row: Row;
  event: any;
}

export interface CellEventArgs {
  columnIndex: number;
  rowIndex: number;
  event: any;
  fromCell: HTMLElement;
}
