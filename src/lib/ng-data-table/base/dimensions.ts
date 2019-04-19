import {Column} from './column';
import {Settings} from './settings';

export class Dimensions {

  bodyHeight: number;
  actionColumnWidth: number = 40;
  columnMenuWidth: number = 220;
  columnsTotalWidth: number;
  frozenColumnsWidth: number;
  scrollableColumnsWidth: number;
  headerRowHeight: number;
  rowHeight: number = 30;
  offsetX: number = 0;
  offsetY: number = 0;
  headerTemplateHeight: number = 0;

  constructor(settings: Settings, private readonly columns: Column[]) {
    this.bodyHeight = settings.bodyHeight;
    this.rowHeight = settings.rowHeight;
    this.headerRowHeight = settings.headerRowHeight;
    this.actionColumnWidth = settings.actionColumnWidth;
    this.calcColumnsTotalWidth();
  }

  calcColumnsTotalWidth() {
    let totalWidth = 0;
    let frozenWidth = 0;
    let scrollWidth = 0;

    for (const column of this.columns) {
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
