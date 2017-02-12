import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: '[datatable-header]',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css'],
})

export class HeaderComponent implements OnInit {

    @Input() public columns: Array <any>;
    @Output() onSort: EventEmitter<any> = new EventEmitter();

    public sortField: string;
    public sortOrder: number;

    constructor() {}

    ngOnInit() {
    }

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

}
