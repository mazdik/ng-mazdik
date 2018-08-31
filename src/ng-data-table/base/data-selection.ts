import {Row} from './types';
import {Events} from './events';

export class DataSelection {

  get multiple(): boolean {
    return this._multiple;
  }

  private selection: number[] = [];

  constructor(private _multiple = false, private events: Events) {
  }

  selectRow(rowIndex: number) {
    if (!this.isRowSelected(rowIndex)) {
      this._markSelected(rowIndex);
      this.events.onSelectionChange();
    }
  }

  selectAllRows(rows: Row[]): void {
    if (rows && rows.length) {
      this._unmarkAll();
      this.select(...rows);
    }
  }

  clearSelection(): void {
    this._unmarkAll();
    this.events.onSelectionChange();
  }

  isRowSelected(rowIndex: number): boolean {
    return this.selection.indexOf(rowIndex) !== -1;
  }

  getSelection(): any[] {
    return this.selection;
  }

  getSelectedRows(rows: any[]): any[] {
    const selectedRows = [];
    if (this.selection.length) {
      for (const idx of this.selection) {
        selectedRows.push(rows[idx]);
      }
    }
    return selectedRows;
  }

  allRowsSelected(rows: Row[]): boolean {
    return(rows &&
      this.selection &&
      this.selection.length === rows.length &&
      rows.length !== 0);
  }

  select(...rows: Row[]): void {
    rows.forEach(value => this._markSelected(value.$$index));
    this.events.onSelectionChange();
  }

  deselect(...rows: Row[]): void {
    rows.forEach(value => this._unmarkSelected(value.$$index));
    this.events.onSelectionChange();
  }

  toggle(rowIndex: number): void {
    this.isRowSelected(rowIndex) ? this._unmarkSelected(rowIndex) : this._markSelected(rowIndex);
    this.events.onSelectionChange();
  }

  isEmpty(): boolean {
    return this.selection.length === 0;
  }

  private _markSelected(rowIndex: number) {
    if (!this.isRowSelected(rowIndex)) {
      if (!this.multiple) {
        this._unmarkAll();
      }
      this.selection.push(rowIndex);
    }
  }

  private _unmarkSelected(rowIndex: number) {
    const index = this.selection.indexOf(rowIndex);
    if (index !== -1) {
      this.selection.splice(index, 1);
    }
  }

  private _unmarkAll() {
    this.selection = [];
  }

}
