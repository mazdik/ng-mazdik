import {Row} from '../types';
import {Settings} from './settings';
import {Events} from './events';

export class DataSelection {

  public selectedRowIndexes: number[] = [];
  public selectedRowIndex: number;

  get multiple(): boolean {
    return this.settings.selectionMultiple;
  }

  constructor(private settings: Settings, private events: Events) {
  }

  selectRow(rowIndex: number) {
    if (this.multiple) {
      const index = this.selectedRowIndexes.indexOf(rowIndex);
      if (index === -1) {
        this.selectedRowIndexes.push(rowIndex);
      } else {
        this.selectedRowIndexes.splice(index, 1);
      }
      this.selectedRowIndex = rowIndex;
    } else {
      if (this.selectedRowIndex !== rowIndex) {
        this.selectedRowIndex = rowIndex;
      }
    }
    this.events.onSelectionChange();
  }

  selectAllRows(rows: Row[]) {
    if (rows && rows.length) {
      this.selectedRowIndexes = [];
      this.selectedRowIndex = null;
      for (const row of rows) {
        this.selectedRowIndexes.push(row.$$index);
        this.selectedRowIndex = row.$$index;
      }
      this.events.onSelectionChange();
    }
  }

  clearSelection() {
    this.selectedRowIndexes = [];
    this.selectedRowIndex = null;
    this.events.onSelectionChange();
  }

  isRowSelected(rowIndex: number): boolean {
    if (this.multiple) {
      return this.selectedRowIndexes.indexOf(rowIndex) !== -1;
    } else {
      return rowIndex === this.selectedRowIndex;
    }
  }

  getSelection() {
    if (this.multiple) {
      return this.selectedRowIndexes;
    } else {
      return this.selectedRowIndex;
    }
  }

  getSelectedRows(rows: any[]) {
    if (this.multiple) {
      const selectedRows = [];
      if (this.selectedRowIndexes.length) {
        for (const idx of this.selectedRowIndexes) {
          selectedRows.push(rows[idx]);
        }
      }
      return selectedRows;
    } else {
      return rows[this.selectedRowIndex];
    }
  }

  allRowsSelected(rows: Row[]): boolean {
    return(rows &&
      this.selectedRowIndexes &&
      this.selectedRowIndexes.length === rows.length &&
      rows.length !== 0);
  }

}
