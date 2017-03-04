import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Column } from '../types/interfaces';

@Component({
    selector: 'detail-view',
    templateUrl: 'detail-view.component.html',
    styleUrls: ['detail-view.component.css'],
})

export class DetailViewComponent {

    @Input() public columns: Column[];
    @Input() public item: any;

    constructor() {}

    format(value: any, column: Column) {
        if(column.format &&  column.format === 'date') {
            let d = new Date(value*1000);
            value = d.toLocaleString('ru');
        }
        return value;
    }

}
