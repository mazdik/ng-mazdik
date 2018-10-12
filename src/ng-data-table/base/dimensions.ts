import {Column} from './column';
import {Settings} from './settings';

export class Dimensions {

  tableWidth: number;
  bodyHeight: number;
  actionColumnWidth: number = 40;
  columnMenuWidth: number = 220;
  columnsTotalWidth: number;
  frozenColumnsWidth: number;
  scrollableColumnsWidth: number;
  headerRowHeight: number;
  rowHeight: number = 30;
  summaryRowHeight: number = 30;
  offsetX: number = 0;
  offsetY: number = 0;
  headerTemplateHeight: number = 0;

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
  }

}
