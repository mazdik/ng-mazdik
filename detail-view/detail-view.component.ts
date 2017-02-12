import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'detail-view',
    templateUrl: 'detail-view.component.html',
    styleUrls: ['detail-view.component.css'],
})

export class DetailViewComponent {

    @Input() public columns: Array <any>;
    @Input() public item: any;

    constructor() {}

}
