import { Column } from './column';
import { Settings } from './settings';

export class Row {

  $$uid: number;
  $$index: number;
  $$data: any;
  $$height: number;
  $$editable: boolean;
  $$level: number;
  private readonly $$settings: Settings;

  constructor(options: { [x: string]: any }, settings?: Settings) {
    Object.assign(this, options);
    this.$$data = options;
    this.$$settings = settings;
  }

  clone(): Row {
    const newRow = new Row(Object.assign({}, this), this.$$settings);
    newRow.$$uid = null;
    newRow.$$index = null;
    newRow.$$data = null;
    return newRow;
  }

  isEditableCell(column: Column): boolean {
    if (column.editable && this.$$settings && this.hasOwnProperty(this.$$settings.isEditableCellProp)) {
      return this[this.$$settings.isEditableCellProp];
    }
    return column.editable;
  }

  getRowClass() {
    const rowClass = this.$$settings ? this.$$settings.rowClass : null;
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
        return column.cellClass({ row: this, column, value: this[column.name] });
      }
    }
  }

  merge(newRow: any) {
    Object.keys(newRow).forEach(key => {
      if (key in this) {
        this[key] = newRow[key];
      }
    });
    this.backup();
  }

  backup(): void {
    this.$$data = Object.assign({}, this);
  }

  revertChanges(columns: Column[]) {
    columns.forEach((column) => {
      this[column.name] = this.$$data[column.name];
    });
  }

  dispose() {
    this.$$data = null;
  }

}
