import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ISelectOption, Column, Filter } from '../types/interfaces';

@Component({
    selector: '[datatable-header]',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css'],
})

export class HeaderComponent {

    @Input() public columns: Column[] ;
    @Output() onSort: EventEmitter < any > = new EventEmitter();
    @Output() onFilter: EventEmitter<any> = new EventEmitter();

    public sortField: string;
    public sortOrder: number;

    public filters: Filter = {};
    public activeColumn: string;

    constructor() {}

    sort(event, column: Column) {
        if (!column.sortable) {
            return;
        }
        this.sortOrder = (this.sortField === column.name) ? this.sortOrder * -1 : 1;
        this.sortField = column.name;
        this.onSort.emit({
            field: this.sortField,
            order: this.sortOrder
        });
    }

    getSortOrder(column: Column) {
        let order = 0;
        if (this.sortField && this.sortField === column.name) {
            order = this.sortOrder;
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

    onColumnMouseEnter(event, column: Column) {
        this.activeColumn = column.name;
    }

    onColumnMouseLeave(event, column: Column) {
        this.activeColumn = null;
    }

    clearAllFilters() {
        //this.filters = {};
        //this.onFilter.emit(this.filters);
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

}
