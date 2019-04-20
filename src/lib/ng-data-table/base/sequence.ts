import {Row} from './row';
import {Column} from './column';

export class Sequence {

  private uidRow: number = 0;

  setColumnIndexes(columns: Column[]): void {
    let columnIndex = 0;
    columns.forEach(column => {
      if (!column.tableHidden) {
        column.index = columnIndex++;
      }
    });
  }

  setRowIndexes(rows: Row[]): void {
    rows.forEach((row, i) => row.$$index = i);
  }

  getUidRow() {
    return ++this.uidRow;
  }

  curUidRow() {
    return this.uidRow;
  }

}
