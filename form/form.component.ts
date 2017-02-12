import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'row-form',
    templateUrl: 'form.component.html',
    styleUrls: ['form.component.css'],
})

export class FormComponent {

    @Input() public columns: Array <any>;
    @Input() public item: any;
    @Input() public settings: Array <any>;

    constructor() {}

    public elemEnabled(name: string): boolean {
    	let pk = (this.settings['primaryKey']) ? this.settings['primaryKey'].toLowerCase() : 'id';
        return (name === pk) ? false : true;
    }

}
