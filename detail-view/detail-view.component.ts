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

}
