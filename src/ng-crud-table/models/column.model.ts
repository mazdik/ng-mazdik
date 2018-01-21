import {Column} from './column';
import {getUid} from '../utils/id';
import {ISelectOption} from '../types';


export class ColumnModel extends Column {

  public id: number;

  constructor(init: Partial<Column>) {
    super();
    Object.assign(this, init);
    this.id = getUid();
    this.setDefaults();
  }

  setDefaults() {
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

  getOptions(dependsValue?: any): ISelectOption[] {
    if (this.options) {
      let options: ISelectOption[];
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
    const options: ISelectOption[] = this.getOptions();
    let name;
    if (options && (value !== undefined || value !== null)) {
      const el: ISelectOption = options.find(o => {
        return o.id.toString() === value.toString();
      });
      name = (el) ? el.name : null;
    }
    return name || value;
  }


}
