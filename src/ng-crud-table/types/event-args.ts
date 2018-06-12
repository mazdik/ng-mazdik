import {Column} from '../base/column';

export interface ColumnMenuEventArgs {
  left: number;
  top: number;
  right: number;
  bottom: number;
  column: Column;
}

export interface CellEventArgs {
  columnIndex: number;
  rowIndex: number;
  event: any;
  fromCell: HTMLElement;
}
