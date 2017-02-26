import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Column, Filter } from '../types/interfaces';

@Component({
    selector: '[input-filter]',
    templateUrl: 'filter.component.html',
    styleUrls: ['filter.component.css'],
})

export class FilterComponent {

    @Input() public column: Column;
    @Output() onFilter: EventEmitter<any> = new EventEmitter();

    public filters: Filter = {};
    public filterTimeout: any;
    public filterDelay: number = 300;

    constructor() {}

    onFilterInputClick(event) {
        event.stopPropagation();
    }

    onFilterKeyup(value, field, matchMode) {
        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }

        this.filterTimeout = setTimeout(() => {
            this.filter(value, field, matchMode);
            this.filterTimeout = null;
        }, this.filterDelay);
    }

    filter(value, field, matchMode) {
        if (!this.isFilterBlank(value))
            this.filters[field] = { value: value, matchMode: matchMode };
        else if (this.filters[field])
            delete this.filters[field];

        this.onFilter.emit(this.filters);
    }

    isFilterBlank(filter: any): boolean {
        if (filter !== null && filter !== undefined) {
            if ((typeof filter === 'string' && filter.trim().length == 0) || (filter instanceof Array && filter.length == 0))
                return true;
            else
                return false;
        }
        return true;
    }

}
