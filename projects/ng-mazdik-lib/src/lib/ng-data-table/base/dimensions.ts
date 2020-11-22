import { Column } from './column';
import { Settings } from './settings';

export class Dimensions {

  bodyHeight: number;
  columnMenuWidth = 220;
  columnsTotalWidth: number;
  rowHeight = 30;
  offsetX = 0;
  offsetY = 0;

  constructor(settings: Settings, private readonly columns: Column[]) {
    this.bodyHeight = settings.bodyHeight;
    this.rowHeight = settings.rowHeight;
    this.recalcColumns();
  }

  calcColumnsTotalWidth(): void {
    this.columnsTotalWidth = this.columns.filter(x => !x.tableHidden).reduce((acc, cur) => acc + cur.width, 0);
  }

  calcColumnsLeftPosition(): void {
    this.columns.filter(x => x.frozen).reduce((acc, cur) => {
      cur.left = acc;
      return acc + cur.width;
    }, 0);
  }

  recalcColumns(): void {
    this.calcColumnsTotalWidth();
    this.calcColumnsLeftPosition();
  }

}
