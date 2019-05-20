import { Column } from './column';
import { Row } from './row';

export class Cell {

  get value(): any { return this._value; }
  set value(val: any) {
    this._value = val;
    this.row[this.column.name] = val;
  }
  private _value: any;

  oldValue: any;
  viewValue: any;
  hasError: boolean;

  get isChanged(): boolean {
    return (this.row && this.row.$$data && this.value !== this.oldValue);
  }

  get rowIndex(): number {
    return (this.row) ? this.row.$$index : null;
  }

  constructor(public readonly row: Row, public readonly column: Column) {
    this._value = this.column.getValue(this.row);
    if (this.row && this.row.$$data) {
      this.oldValue = this.column.getValue(this.row.$$data);
    }
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
    this.viewValue = this.column.getValueView(this.row);
  }

  getOptions() {
    return this.column.getOptions(this.row[this.column.dependsColumn]);
  }

}
