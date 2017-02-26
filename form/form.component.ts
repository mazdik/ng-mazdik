import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Column, Settings } from '../types/interfaces';

@Component({
    selector: 'row-form',
    templateUrl: 'form.component.html',
    styleUrls: ['form.component.css'],
})

export class FormComponent {

    @Input() public columns: Column[];
    @Input() public settings: Settings;
    @Input() public item: any;

    constructor() {}

    public elemEnabled(name: string): boolean {
    	let pk = (this.settings['primaryKey']) ? this.settings['primaryKey'].toLowerCase() : 'id';
        return (name === pk) ? false : true;
    }

}
