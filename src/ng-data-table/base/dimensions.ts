import {Column} from './column';
import {Settings} from './settings';
import {Row} from './types';

export class Dimensions {

  tableWidth: number;
  bodyHeight: number;
  actionColumnWidth: number = 40;
  columnMenuWidth: number = 200;
  columnsTotalWidth: number;
  frozenColumnsWidth: number;
  scrollableColumnsWidth: number;
  headerRowHeight: number = 40;
  rowHeight: number = 30;
  summaryRowHeight: number = 30;
  scrollHeight: number;
  offsetX: number = 0;
  offsetY: number = 0;
  headerTemplateHeight: number = 0;

  private rowHeightCache: number[] = [];

  constructor(private settings: Settings, private columns: Column[]) {
    this.tableWidth = this.settings.tableWidth;
    this.bodyHeight = this.settings.bodyHeight;
    this.rowHeight = this.settings.rowHeight;
    this.headerRowHeight = this.settings.headerRowHeight;
    this.actionColumnWidth = this.settings.actionColumnWidth;
    this.calcColumnsTotalWidth(this.columns);
  }

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
    this.scrollHeight = this.rowHeightCache[totalRecords - 1];
  }

  initRowHeightCache(rows: Row[]) {
    const size = rows.length;
    this.rowHeightCache = new Array(size);
    for (let i = 0; i < size; ++i) {
      this.rowHeightCache[i] = 0;
    }
    rows.forEach((row, i) => {
      for (let index = i; index < size; index++) {
        this.rowHeightCache[index] += row.$$height;
      }
      row.$$offset = (i === 0) ? 0 : this.rowHeightCache[i - 1];
    });
  }

  calcRowIndex(offsetY: number): number {
    if (offsetY === 0) {
      return 0;
    }
    let pos = -1;
    const dataLength = this.rowHeightCache.length;

    for (let i = dataLength; i >= 0; i--) {
      const nextPos = pos + i;
      if (nextPos < dataLength && offsetY >= this.rowHeightCache[nextPos]) {
        offsetY -= this.rowHeightCache[nextPos];
        pos = nextPos;
      }
    }
    return pos + 1;
  }

  getRowOffset(rowIndex: number) {
    if (rowIndex < 0) {
      return 0;
    }
    return this.rowHeightCache[rowIndex];
  }

}
