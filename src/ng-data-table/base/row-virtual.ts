import { Row } from './types';
import { Settings } from './settings';
import { DataPager } from './data-pager';
import { Dimensions } from './dimensions';
import { Events } from './events';

export class RowVirtual {

  virtualRows: Row[] = [];
  private start: number;
  private end: number;
  private previousStart: number;
  private previousEnd: number;
  private itemSize: number = 20;

  constructor(private settings: Settings, private pager: DataPager,
    private dimensions: Dimensions, private events: Events) {
  }

  chunkRows(rows: Row[], force: boolean = false) {
    this.dimensions.initRowHeightCache(rows);
    this.setItemSize();
    if (this.settings.virtualScroll && !this.dimensions.bodyHeight) {
      this.dimensions.calcBodyHeight(this.itemSize);
    }
    if (this.settings.virtualScroll) {
      const totalRecords = rows.length;
      this.dimensions.calcScrollHeight(totalRecords);

      this.start = this.dimensions.calcRowIndex(this.dimensions.offsetY);
      this.end = Math.min(totalRecords, this.start + this.itemSize + 1);
      if ((this.end - this.start) < 3) {
        this.start = this.end - this.itemSize;
      }

      if (this.start !== this.previousStart || this.end !== this.previousEnd || force === true) {
        const virtualRows = rows.slice(this.start, this.end);
        this.previousStart = this.start;
        this.previousEnd = this.end;
        this.virtualRows = virtualRows;
      }
    }
  }

  updatePage(direction: string): void {
    if (this.settings.virtualScroll && direction && this.pager) {
      let page = this.start / this.itemSize;
      if (direction === 'up') {
        page = Math.floor(page);
      } else if (direction === 'down') {
        page = Math.ceil(page);
      }
      page += 1;
      if (page !== this.pager.current) {
        this.pager.current = page;
        this.events.onPage();
      }
    }
  }

  resetPosition() {
    this.start = 0;
    this.end = 0;
    this.previousStart = 0;
    this.previousEnd = 0;
  }

  calcPageOffsetY(page: number) {
    const rowIndex = this.itemSize * (page - 1);
    return this.dimensions.getRowOffset(rowIndex - 1);
  }

  private setItemSize() {
    if (this.pager) {
      this.itemSize = this.pager.perPage;
    } else if (this.dimensions.bodyHeight && this.dimensions.rowHeight) {
      this.itemSize = Math.round(this.dimensions.bodyHeight / this.dimensions.rowHeight);
    }
  }

}
