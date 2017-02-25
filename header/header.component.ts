import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
    selector: '[datatable-header]',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css'],
})

export class HeaderComponent {

    @Input() public columns: Array <any>;
    @Output() onSort: EventEmitter<any> = new EventEmitter();

    public sortField: string;
    public sortOrder: number;

    @ViewChild('selectFilter') selectFilter: any;

    public options: Array < any > = this.options || [];
    public selectedOptions: any[];
    public filters: {
        [s: string]: any;
    } = {};
    public column: string;
    public activeColumn: string;

    constructor() {}

    sort(event, column: any) {
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

    getSortOrder(column: any) {
        let order = 0;
        if (this.sortField && this.sortField === column.name) {
            order = this.sortOrder;
        }
        return order;
    }

    showColumnMenu(event, column) {
        //event.stopPropagation();
        this.column = column;
        this.selectedOptions = this.filters[this.column];

        if (column === 'www') {
            this.options = [
                { id: 12, name: 'Option 12' },
                { id: 2, name: 'Option 2' },
                { id: 3, name: 'Option 3' },
                { id: 4, name: 'Option 4' }
            ];
        } else {
            this.options = [
                { id: 1, name: 'Option 1' },
                { id: 2, name: 'Option 2' },
                { id: 3, name: 'Option 3' },
                { id: 4, name: 'Option 4' },
                { id: 5, name: 'Option 5' },
                { id: 6, name: 'Option 6' },
            ];
        }
        let el = event.target.parentNode;
        let width = (el.offsetWidth > 200) ? el.offsetWidth : 200;
        this.selectFilter.show(width, el.offsetHeight, el.offsetLeft);
    }

    isFilter(column): boolean {
        let length = this.filters[column] && this.filters[column].length || 0;
        return length > 0 ? true : false;
    }

    onChangeSelect(event) {
        this.filters[this.column] = event;
        this.selectedOptions = event;
/*        console.log(this.selectedOptions);
        console.log(this.filters);*/
    }

    onColumnMouseEnter(event, column) {
        this.activeColumn = column;
    }
    
    onColumnMouseLeave(event, column) {
        this.activeColumn = null;
    }

}
