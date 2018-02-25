import {SelectionType} from '../types';

export class DataSelection {

  public type: SelectionType = 'single';
  public selectedRowIndexes: number[] = [];
  public selectedRowIndex: number;

  constructor() {
  }

  selectRow(rowIndex: number) {
    this.selectedRowIndex = rowIndex;
    if (this.type === 'multiple') {
      const index = this.selectedRowIndexes.indexOf(rowIndex);
      if (index === -1) {
        this.selectedRowIndexes.push(rowIndex);
      } else {
        this.selectedRowIndexes.splice(index, 1);
      }
    }
  }

  clearRowSelection() {
    this.selectedRowIndexes = [];
    this.selectedRowIndex = null;
  }

  isRowSelected(rowIndex: number): boolean {
    if (this.type === 'multiple') {
      return this.selectedRowIndexes.indexOf(rowIndex) !== -1;
    } else {
      return rowIndex === this.selectedRowIndex;
    }
  }

  getSelection() {
    if (this.type === 'multiple') {
      return this.selectedRowIndexes;
    } else {
      return this.selectedRowIndex;
    }
  }

  getSelectedRows(rows: any[]) {
    if (this.type === 'multiple') {
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

}
