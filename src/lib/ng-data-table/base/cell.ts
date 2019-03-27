import { Column } from './column';
import { Row } from './types';

export class Cell {

  get value(): any { return this._value; }
  set value(val: any) {
    this._value = val;
    this.row[this.column.name] = val;
  }
  private _value: any;

  viewValue: any;
  oldValue: any;
  hasError: boolean;

  get isChanged(): boolean {
    return (this.row && this.row.$$data && this.value !== this.column.getValue(this.row.$$data));
  }

  get rowIndex(): number {
    return (this.row) ? this.row.$$index : null;
  }

  constructor(public row: Row, public column: Column) {
    this._value = this.column.getValue(this.row);
    this.updateViewValue();
  }

  validate() {
    const errors = this.column.validate(this.value);
    this.hasError = (errors && errors.length > 0);
  }

  exist(rowIndex: number, columnIndex: number): boolean {
    return this.row.$$index === rowIndex && this.column.index === columnIndex;
  }

  updateViewValue(): void {
    if (this.value !== this.oldValue) {
      this.oldValue = this.value;
      this.viewValue = this.column.getValueView(this.row);
    }
  }

  getOptions() {
    return this.column.getOptions(this.row[this.column.dependsColumn]);
  }

}
