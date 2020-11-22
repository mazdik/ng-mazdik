import { Row } from './row';
import { Settings } from './settings';
import { Column } from './column';

export class RowModelGenerator {

  private uidRow = 0;

  constructor(private readonly settings: Settings, private readonly columns: Column[]) { }

  getUidRow(): number {
    return ++this.uidRow;
  }

  curUidRow(): number {
    return this.uidRow;
  }

  generateRow(row: any): Row {
    if (!(row instanceof Row)) {
      row = new Row(row, this.settings);
    }
    this.columns.forEach((column) => {
      if (column.containsDots) {
        row[column.name] = column.getValue(row);
      }
    });
    if (!row.$$uid) {
      row.$$uid = this.getUidRow();
    }
    return row;
  }

  generateRows(data: any[]): Row[] {
    return data.map(x => this.generateRow(x));
  }

  setRowIndexes(rows: Row[]): void {
    rows.forEach((row, i) => row.$$index = i);
  }

}
