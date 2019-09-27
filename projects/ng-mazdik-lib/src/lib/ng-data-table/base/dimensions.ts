import {Column} from './column';
import {Settings} from './settings';

export class Dimensions {

  bodyHeight: number;
  columnMenuWidth: number = 220;
  columnsTotalWidth: number;
  headerRowHeight: number;
  rowHeight: number = 30;
  offsetX: number = 0;
  offsetY: number = 0;

  constructor(settings: Settings, private readonly columns: Column[]) {
    this.bodyHeight = settings.bodyHeight;
    this.rowHeight = settings.rowHeight;
    this.headerRowHeight = settings.headerRowHeight;
    this.recalcColumns();
  }

  calcColumnsTotalWidth() {
    this.columnsTotalWidth = this.columns.filter(x => !x.tableHidden).reduce((acc, cur) => acc + cur.width, 0);
  }

  calcColumnsLeftPosition() {
    this.columns.filter(x => x.frozen).reduce((acc, cur) => {
      cur.left = acc;
      return acc + cur.width;
    }, 0);
  }

  recalcColumns() {
    this.calcColumnsTotalWidth();
    this.calcColumnsLeftPosition();
  }

}
