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
      const isUnSelected = this.selectedRowIndexes.indexOf(rowIndex) > -1;
      if (isUnSelected) {
        this.selectedRowIndexes.push(rowIndex);
      }
    } else {
      this.selectedRowIndexes = [rowIndex];
    }
  }

  clearRowSelection() {
    this.selectedRowIndexes = [];
    this.selectedRowIndex = null;
  }

  isRowSelected(rowIndex: number): boolean {
    return rowIndex === this.selectedRowIndex;
  }

}
