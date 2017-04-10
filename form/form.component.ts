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

    public beginValidate: any[] = [];

    constructor() {}

    elemEnabled(name: string): boolean {
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

    setErrors(column: Column) {
    	let temp = [];
    	if (!column.validation) return temp;
    	const length: number = this.item[column.name] ? this.item[column.name].length : 0;
    	
    	if(column.validation.required && !this.item[column.name]) {
    		temp.push(`${column.title} is required.`);
    	}
     	if(column.validation.minLength && length < column.validation.minLength) {
    		temp.push(`${column.title} has to be at least ${column.validation.minLength} characters long. ActualLength: ${length}`);
    	}
     	if(column.validation.maxLength && length > column.validation.maxLength) {
    		temp.push(`${column.title} can't be longer then ${column.validation.maxLength} characters. ActualLength: ${length}`);
    	}
    	return temp;
    }

    errors(column: Column) {
    	if(this.beginValidate[column.name]) {
    		return this.setErrors(column);
    	}
    }

    startValidate(column: Column) {
    	this.beginValidate[column.name] = true;
    }

    hasError(column: Column) {
    	return (this.errors(column)) ? this.errors(column).length > 0 : false; 
    }

}
