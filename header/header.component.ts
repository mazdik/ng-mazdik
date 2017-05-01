import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ISelectOption, Column, Filter, SortMeta } from '../types/interfaces';

@Component({
    selector: '[datatable-header]',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css'],
})

export class HeaderComponent {

    @Input() public columns: Column[] ;
    @Input() public filters: Filter = {};
    @Input() public firstColumn: boolean = false;
    @Input() public sortMeta: SortMeta;
    @Input() public actionColumnWidth: number;

    @Output() onSort: EventEmitter < any > = new EventEmitter();
    @Output() onFilter: EventEmitter<any> = new EventEmitter();
    @Output() onShowColumnMenu: EventEmitter<any> = new EventEmitter();
    @Output() onClearAllFilters: EventEmitter<any> = new EventEmitter();
    @Output() onResize: EventEmitter<any> = new EventEmitter();

    public minWidthColumn: number = 50;
    public maxWidthColumn: number = 500;

    constructor() {}

    sort(event, column: Column) {
        if (!column.sortable) {
            return;
        }
        this.sortMeta.order = (this.sortMeta.field === column.name) ? this.sortMeta.order * -1 : 1;
        this.sortMeta.field = column.name;
        this.onSort.emit({
            sortMeta: this.sortMeta
        });
    }

    getSortOrder(column: Column) {
        let order = 0;
        if (this.sortMeta.field && this.sortMeta.field === column.name) {
            order = this.sortMeta.order;
        }
        return order;
    }

    isFilter(column: Column): boolean {
        let length = this.filters[column.name] && this.filters[column.name].value.trim().length || 0;
        return length > 0 ? true : false;
    }

    filter(event) {
        this.filters = event;
        this.onFilter.emit(this.filters);
    }

    clearAllFilters() {
        this.filters = {};
        this.onClearAllFilters.emit(true);
    }

    hasFilter() {
        let empty = true;
        for(let prop in this.filters) {
            if(this.filters.hasOwnProperty(prop)) {
                empty = false;
                break;
            }
        }
        return !empty;
    }

    showColumnMenu(event, column: Column) {
        let el = event.target.parentNode;
        let left = el.offsetLeft;
        let top = el.offsetTop;
        let trHeight = this.getHeight(el.parentNode);
        top = top + trHeight;

        let doc = el.parentNode.parentNode.parentNode.parentNode;
        let windowScrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        left = left - windowScrollLeft;

        this.onShowColumnMenu.emit({'top':top, 'left':left, 'column': column});
    }

    getHeight(el): number {
        let height = el.offsetHeight;
        let style = getComputedStyle(el);
        height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
        return height;
    }

    onColumnResized(width: number, column: Column): void {

        if (width <= this.minWidthColumn) {
            width = this.minWidthColumn;
        } else if (width >= this.maxWidthColumn) {
            width = this.maxWidthColumn;
        }

        this.onResize.emit({
            column: column,
            newValue: width
        });
    }

}
