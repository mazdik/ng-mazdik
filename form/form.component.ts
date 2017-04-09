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

    isSelectActive(column, option) {
        if (Array.isArray(this.item[column.name])) {
            return this.item[column.name].find(a => a === option.id) ? true : false;
        } else {
            return this.item[column.name] === option.id;
        }
    }

}
