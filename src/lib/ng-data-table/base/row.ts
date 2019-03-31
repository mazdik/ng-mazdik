import { Column } from './column';
import { Cell } from './cell';
import { Settings } from './settings';

export class Row {

  $$uid: number;
  $$index: number;
  $$data: Object;
  $$height: number;
  $$editable: boolean;
  $$level: number;

  constructor(options: { [x: string]: Object }, private settings?: Settings) {
    Object.assign(this, options);
  }

  clone(): Row {
    const newRow = new Row(Object.assign({}, this), this.settings);
    newRow.$$uid = null;
    newRow.$$index = null;
    newRow.$$data = null;
    return newRow;
  }

  createCell(column: Column): Cell {
    return new Cell(this, column);
  }

  isEditableCell(column: Column): boolean {
    if (column.editable && this.settings && this.hasOwnProperty(this.settings.isEditableCellProp)) {
      return this[this.settings.isEditableCellProp];
    }
    return column.editable;
  }

  getRowClass() {
    const rowClass = this.settings ? this.settings.rowClass : null;
    if (rowClass) {
      if (typeof rowClass === 'string') {
        return rowClass;
      } else if (typeof rowClass === 'function') {
        return rowClass(this);
      }
    }
  }

  getCellClass(column: Column) {
    if (column.cellClass) {
      if (typeof column.cellClass === 'string') {
        return column.cellClass;
      } else if (typeof column.cellClass === 'function') {
        return column.cellClass({row: this, column, value: this[column.name]});
      }
    }
  }

}
