import { Row } from '../types';
import { Settings } from './settings';
import { DataPager } from './data-pager';
import { Dimensions } from './dimensions';
import { Events } from './events';

export class RowVirtual {

    private start: number;
    private end: number;
    private previousStart: number;
    private previousEnd: number;
    private cache: number[] = [];

    constructor(private settings: Settings,
        private pager: DataPager,
        private dimensions: Dimensions,
        private events: Events) {
    }

    chunkRows(rows: Row[], offsetY: number, force: boolean = false) {
        this.initCache(rows);
        if (this.settings.virtualScroll && !this.dimensions.bodyHeight) {
            this.dimensions.calcBodyHeight(this.pager.perPage);
        }
        if (this.settings.virtualScroll) {
            this.pager.total = rows.length;
            const totalRecords = this.pager.total;
            this.dimensions.calcScrollHeight(totalRecords);

            this.start = this.calcRowIndex(offsetY);
            this.end = Math.min(totalRecords, this.start + this.pager.perPage + 1);
            if ((this.end - this.start) < 3) {
                this.start = this.end - this.pager.perPage;
            }

            if (this.start !== this.previousStart || this.end !== this.previousEnd || force === true) {
                const virtualRows = rows.slice(this.start, this.end);
                this.previousStart = this.start;
                this.previousEnd = this.end;
                return virtualRows;
            }
        }
    }

    updatePage(direction: string): void {
        if (this.settings.virtualScroll && direction) {
            let page = this.start / this.pager.perPage;
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

    initCache(rows: Row[]) {
        const size = rows.length;
        this.cache = new Array(size);
        for (let i = 0; i < size; ++i) {
            this.cache[i] = 0;
        }
        rows.forEach((row, i) => {
            for (let index = i; index < size; index++) {
                this.cache[index] += row.$$height;
            }
            row.$$offset = (i === 0) ? 0 : this.cache[i - 1];
        });
    }

    private calcRowIndex(offsetY: number): number {
        if (offsetY === 0) { return 0; }
        let pos = -1;
        const dataLength = this.cache.length;

        for (let i = dataLength; i >= 0; i--) {
          const nextPos = pos + i;
          if (nextPos < dataLength && offsetY >= this.cache[nextPos]) {
            offsetY -= this.cache[nextPos];
            pos = nextPos;
          }
        }
        return pos + 1;
    }

    getRowOffset(rowIndex: number) {
        if (rowIndex < 0) { return 0; }
        return this.cache[rowIndex];
    }

    calcPageOffsetY(page: number) {
        const rowIndex = this.pager.perPage * (page - 1);
        const offset = this.getRowOffset(rowIndex - 1);
        return offset;
    }

}
