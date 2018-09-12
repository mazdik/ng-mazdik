import {ColumnBase} from './column-base';
import {isBlank} from './util';
import {SelectOption, DataType} from './types';
import {Settings} from './settings';
import {Validators} from './validators';

export class Column extends ColumnBase {

  index: number;
  filterValues: SelectOption[] = [];

  get containsDots(): boolean {
    return (this.name.indexOf('.') >= 0);
  }

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
      this.width = (this.title.length * 10);
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
    if (!this.dataType) {
      if (this.type === 'date' || this.type === 'datetime-local') {
        this.dataType = DataType.Date;
      } else if (this.type === 'number') {
        this.dataType = DataType.Number;
      }
    }
  }

  getOptions(dependsValue?: any): SelectOption[] {
    if (this.options) {
      if (this.dependsColumn && dependsValue) {
        return this.options.filter((value) => value.parentId === dependsValue);
      } else {
        return this.options;
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
    if (this.validatorFunc) {
      return this.validatorFunc(this.title, value);
    }
    return Validators.validate(this.title, value, this.validation);
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
    if (this.containsDots) {
      return this.getDeepValue(row, this.name);
    } else {
      return row[this.name];
    }
  }

  getDeepValue(data: any, path: string): any {
    if (!data) {
      return '';
    }
    if (data[path] !== undefined) {
      return data[path];
    }
    const fields = path.split('.');
    let currentObject = data;
    for (let i = 0; i < fields.length; i++) {
        currentObject = currentObject[fields[i]];
        if (isBlank(currentObject)) {
            return null;
        }
    }
    return currentObject;
  }

  getValueView(row: any) {
    let value = this.getValue(row);
    if (value) {
      value = this.getOptionName(value);
    }
    return value;
  }

  getFilterValues(): Promise<SelectOption[]> {
    if (this.filterValuesFunc) {
      return this.filterValuesFunc(this.name);
    } else if (this.options) {
      return Promise.resolve(this.options);
    }
    return Promise.resolve([]);
  }

}
