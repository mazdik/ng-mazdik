import { Column } from './column';
import { Row } from './types';

export class Cell {

  value: any;
  hasError: boolean;

  get isChanged(): boolean {
    return (this.row && this.row.$$data && this.value !== this.column.getValue(this.row.$$data));
  }

  constructor(public row: Row, public column: Column) {
    this.value = this.column.getValue(this.row);
  }

  validate() {
    if (this.column.editable) {
      const errors = this.column.validate(this.value);
      this.hasError = (errors && errors.length > 0);
    }
  }

  exist(rowIndex: number, columnIndex: number): boolean {
    return this.row.$$index === rowIndex && this.column.index === columnIndex;
  }

  getOptions() {
    return this.column.getOptions(this.row[this.column.dependsColumn]);
  }

}
