import {Component, Input, ViewChild, ViewContainerRef, OnInit, OnDestroy} from '@angular/core';
import {Column, Settings} from '../types/interfaces';
import {ColumnUtils} from '../utils/column-utils';

@Component({
  selector: 'row-form',
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.css'],
})

export class FormComponent implements OnInit, OnDestroy {

  @Input() public columns: Column[];
  @Input() public settings: Settings;
  @Input() public item: any;
  @Input() public isNew: boolean = true;

  public beginValidate: any[] = [];
  @ViewChild('cellTemplate', { read: ViewContainerRef }) cellTemplate: ViewContainerRef;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.cellTemplate) {
      this.cellTemplate.clear();
    }
  }

  elemEnabled(name: string): boolean {
    if (Array.isArray(this.settings.primaryKey)) {
      if (!this.isNew) {
        return (this.settings.primaryKey.indexOf(name) === -1);
      } else {
        return true;
      }
    } else {
      const pk = (this.settings['primaryKey']) ? this.settings['primaryKey'].toLowerCase() : null;
      return (name !== pk);
    }
  }

  isSelectActive(column, option) {
    if (Array.isArray(this.item[column.name])) {
      return this.item[column.name].find(a => a === option.id) ? true : false;
    } else {
      return this.item[column.name] === option.id;
    }
  }

  setErrors(column: Column) {
    const temp = [];
    if (!column.validation) {
      return temp;
    }
    const length: number = this.item[column.name] ? this.item[column.name].length : 0;

    if (column.validation.required && !this.item[column.name]) {
      temp.push(`${column.title} is required.`);
    }
    if (column.validation.minLength && length < column.validation.minLength) {
      temp.push(`${column.title} has to be at least ${column.validation.minLength} characters long. ActualLength: ${length}`);
    }
    if (column.validation.maxLength && length > column.validation.maxLength) {
      temp.push(`${column.title} can't be longer then ${column.validation.maxLength} characters. ActualLength: ${length}`);
    }
    if (column.validation.pattern && this.item[column.name] && this.pattern(column)) {
      temp.push(this.pattern(column));
    }
    return temp;
  }

  errors(column: Column) {
    if (this.beginValidate[column.name]) {
      return this.setErrors(column);
    }
  }

  startValidate(column: Column) {
    this.beginValidate[column.name] = true;
  }

  hasError(column: Column) {
    return (this.errors(column)) ? this.errors(column).length > 0 : false;
  }

  pattern(column: Column): string {
    const pattern: string | RegExp = column.validation.pattern;
    let regex: RegExp;
    let regexStr: string;
    if (typeof pattern === 'string') {
      regexStr = `^${pattern}$`;
      regex = new RegExp(regexStr);
    } else {
      regexStr = pattern.toString();
      regex = pattern;
    }
    return regex.test(this.item[column.name]) ? null : `${column.title} must match this pattern: ${regexStr}.`;
  }

  getOptions(column: Column) {
    return ColumnUtils.getOptions(column, this.item);
  }

}
