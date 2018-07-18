import {ColumnBase} from './column-base';
import {isBlank} from './util';
import {SelectOption} from '../types';
import {Settings} from './settings';

export class Column extends ColumnBase {

  public index: number;

  constructor(init: Partial<ColumnBase>, private settings: Settings) {
    super();
    Object.assign(this, init);
    this.setSettings();
  }

  private setSettings() {
    /* disable sort for all column */
    if (this.settings.sortable === false) {
      this.sortable = false;
    }
    /* disable filter for all column */
    if (this.settings.filter === false) {
      this.filter = false;
    }
    // hide if column is grouped
    if (this.settings.groupRowsBy && this.settings.groupRowsBy.length) {
      if (this.settings.groupRowsBy.indexOf(this.name) >= 0) {
        this.tableHidden = true;
      }
    }
    this.setDefaults();
  }

  private setDefaults() {
    if (!this.width) {
      this.width = (this.name.length * 10) + 50;
      if (this.width < 150) {
        this.width = 150;
      }
    }
    if (!this.type) {
      if (this.options) {
        this.type = 'select';
      } else {
        this.type = 'text';
      }
    }
  }

  getOptions(dependsValue?: any): SelectOption[] {
    if (this.options) {
      let options: SelectOption[];
      if (typeof this.options === 'function') {
        options = this.options();
      } else {
        options = this.options;
      }
      if (this.dependsColumn && dependsValue) {
        return options.filter((value) => value.parentId === dependsValue);
      } else {
        return options;
      }
    }
  }

  getOptionName(value: any) {
    if (!this.options) {
      return value;
    }
    const options: SelectOption[] = this.getOptions();
    let name;
    if (options && !isBlank(value)) {
      const el: SelectOption = options.find(o => {
        return o.id.toString() === value.toString();
      });
      name = (el) ? el.name : null;
    }
    return name || value;
  }

  validate(value: any) {
    const temp = [];
    if (!this.validation) {
      return temp;
    }
    const length: number = value ? value.length : 0;

    if (this.validation.required && isBlank(value)) {
      temp.push(`${this.title} is required.`);
    }
    if (this.validation.minLength && length < this.validation.minLength) {
      temp.push(`${this.title} has to be at least ${this.validation.minLength} characters long. ActualLength: ${length}`);
    }
    if (this.validation.maxLength && length > this.validation.maxLength) {
      temp.push(`${this.title} can't be longer then ${this.validation.maxLength} characters. ActualLength: ${length}`);
    }
    if (this.validation.pattern && value) {
      const patternResult = this.patternValidate(value);
      if (patternResult) {
        temp.push(patternResult);
      }
    }
    return temp;
  }

  private patternValidate(value: any): string {
    const pattern: string | RegExp = this.validation.pattern;
    let regex: RegExp;
    let regexStr: string;
    if (typeof pattern === 'string') {
      regexStr = pattern;
      regex = new RegExp(regexStr);
    } else {
      regexStr = pattern.toString();
      regex = pattern;
    }
    return regex.test(value) ? null : `${this.title} must match this pattern: ${regexStr}.`;
  }

  setWidth(width: number) {
    if (width <= this.minWidth) {
      width = this.minWidth;
    } else if (width >= this.maxWidth) {
      width = this.maxWidth;
    }
    this.width = width;
  }

  getValue(row: any) {
    if (!row) {
      return '';
    }
    return row[this.name];
  }

  getValueView(row: any) {
    let value = this.getValue(row);
    if (value) {
      value = this.getOptionName(value);
    }
    return value;
  }

}
