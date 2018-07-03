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

    constructor(private settings: Settings,
        private pager: DataPager,
        private dimensions: Dimensions,
        private events: Events) {
    }

    chunkRows(rows: Row[], offsetY: number, force: boolean = false) {
        if (this.settings.virtualScroll && !this.dimensions.bodyHeight) {
            this.dimensions.calcBodyHeight(this.pager.perPage);
        }
        if (this.settings.virtualScroll) {
            this.pager.total = rows.length;
            const totalRecords = this.pager.total;
            this.dimensions.calcScrollHeight(totalRecords);

            this.start = Math.floor(offsetY / this.dimensions.rowHeight);
            this.end = Math.min(totalRecords, this.start + this.pager.perPage + 1);

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

}
