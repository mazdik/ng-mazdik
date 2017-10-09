import {Injectable} from '@angular/core';
import {Column} from '../types/interfaces';

@Injectable()
export class CustomValidator {

  private setErrors(column: Column, value: any) {
    const temp = [];
    if (!column.validation) {
      return temp;
    }
    const length: number = value ? value.length : 0;

    if (column.validation.required && !value) {
      temp.push(`${column.title} is required.`);
    }
    if (column.validation.minLength && length < column.validation.minLength) {
      temp.push(`${column.title} has to be at least ${column.validation.minLength} characters long. ActualLength: ${length}`);
    }
    if (column.validation.maxLength && length > column.validation.maxLength) {
      temp.push(`${column.title} can't be longer then ${column.validation.maxLength} characters. ActualLength: ${length}`);
    }
    if (column.validation.pattern && value && this.pattern(column, value)) {
      temp.push(this.pattern(column, value));
    }
    return temp;
  }

  private pattern(column: Column, value: any): string {
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
    return regex.test(value) ? null : `${column.title} must match this pattern: ${regexStr}.`;
  }

  errors(column: Column, value: any) {
      return this.setErrors(column, value);
  }

  hasError(column: Column, value: any) {
    return (this.errors(column, value)) ? this.errors(column, value).length > 0 : false;
  }

}
