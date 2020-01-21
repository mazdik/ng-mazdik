import { ColumnBase } from './column-base';
import { isBlank, getDeepValue, inputIsDateType } from '../../common/utils';
import { DataType } from './types';
import { SelectItem } from '../../common';

export class Column extends ColumnBase {

  index: number;
  filterValuesTemp: SelectItem[] = [];
  left: number;

  get containsDots(): boolean {
    return (this.name.indexOf('.') >= 0);
  }

  get isDateType(): boolean {
    return inputIsDateType(this.type);
  }

  constructor(init: Partial<ColumnBase>) {
    super();
    Object.assign(this, init);
    this.setDefaults();
  }

  private setDefaults() {
    if (!this.width) {
      this.width = 150;
    }
    if (this.width < this.minWidth) {
      this.width = this.minWidth;
    }
    if (this.width > this.maxWidth) {
      this.width = this.maxWidth;
    }
    if (!this.type) {
      if (this.options) {
        this.type = 'select';
      } else {
        this.type = 'text';
      }
    }
    if (!this.dataType) {
      if (this.isDateType) {
        this.dataType = DataType.Date;
      } else if (this.type === 'number') {
        this.dataType = DataType.Number;
      }
    }
  }

  getOptions(dependsValue?: any): SelectItem[] {
    if (this.options) {
      if (this.dependsColumn && dependsValue) {
        return this.options.filter((value) => value.parentId === dependsValue);
      } else {
        return this.options;
      }
    }
  }

  getOptionName(value: any, dependsValue?: any) {
    const options = this.getOptions(dependsValue);
    if (!options || isBlank(value)) {
      return value;
    }
    const el = options.find(o => o.id.toString() === value.toString());
    return (el) ? el.name : null;
  }

  validate(value: any): string[] {
    if (this.validatorFunc && this.editable) {
      return this.validatorFunc(this.title, value);
    }
    return [];
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
      return getDeepValue(row, this.name);
    } else {
      return row[this.name];
    }
  }

  getValueView(row: any) {
    let value = this.getValue(row);
    const dependsValue = row[this.dependsColumn] ? row[this.dependsColumn] : null;
    if (value) {
      value = this.getOptionName(value, dependsValue);
    }
    if (this.pipe) {
      value = this.pipe.transform(value);
    }
    return value;
  }

  getFilterValues(): Promise<SelectItem[]> {
    if (this.filterValues && typeof this.filterValues === 'function') {
      return this.filterValues(this.name);
    } else if (this.filterValues && this.filterValues instanceof Array) {
      return Promise.resolve(this.filterValues);
    } else if (this.options) {
      return Promise.resolve(this.options);
    }
    return Promise.resolve([]);
  }

}
