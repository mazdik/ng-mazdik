import {Column} from './column';

export class Dimensions {

  public tableWidth: number;
  public bodyHeight: number;
  public actionColumnWidth: number = 40;
  public columnMenuWidth: number = 200;
  public columnsTotalWidth: number;
  public frozenColumnsWidth: number;
  public scrollableColumnsWidth: number;
  public rowHeight: number = 30;
  public scrollHeight: number;

  calcColumnsTotalWidth(columns: Column[]) {
    let totalWidth = 0;
    let frozenWidth = 0;
    let scrollWidth = 0;

    for (const column of columns) {
      if (!column.tableHidden) {
        totalWidth = totalWidth + column.width;

        if (column.frozen) {
          frozenWidth = frozenWidth + column.width;
        } else {
          scrollWidth = scrollWidth + column.width;
        }
      }
    }
    this.columnsTotalWidth = totalWidth + this.actionColumnWidth;
    this.frozenColumnsWidth = frozenWidth;
    this.scrollableColumnsWidth = scrollWidth;

    if (!this.tableWidth && this.columnsTotalWidth < 800) {
      this.tableWidth = this.columnsTotalWidth;
    }
  }

  calcBodyHeight(perPage: number) {
    this.bodyHeight = (perPage * this.rowHeight);
    if (this.bodyHeight > 0) {
      this.bodyHeight -= this.rowHeight;
    }
  }

  calcScrollHeight(totalRecords: number) {
    this.scrollHeight = totalRecords * this.rowHeight;
  }

}
