import {Column} from '../types';

export class ColumnUtils {

  public static getOptionName(value: any, column: Column) {
    if (column.options) {
      let name = null;
      let options;
      if (typeof column.options === 'function') {
        options = column.options();
      } else {
        options = column.options;
      }
      if (options && (value !== undefined || value !== null)) {
        for (const el of options) {
          if (el['id'].toString() === value.toString()) {
            name = el['name'];
            break;
          }
        }
      }
      return name || value;
    } else {
      return value;
    }
  }

  public static getOptions(column: Column, dependsValue: any) {
    if (column.options) {
      let options;
      if (typeof column.options === 'function') {
        options = column.options();
      } else {
        options = column.options;
      }
      if (column.dependsColumn) {
        return options.filter((value) => value.parentId === dependsValue);
      } else {
        return options;
      }
    }
  }

}
