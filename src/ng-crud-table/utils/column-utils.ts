import {Column, Settings} from '../types/interfaces';

export class ColumnUtils {

  public static setColumnDefaults(columns: Column[], settings: Settings): Column[] {
    if (!columns) {
      return;
    }
    for (const column of columns) {
      if (!column.hasOwnProperty('sortable') && settings.sortable) {
        column.sortable = true;
      }
      if (!column.hasOwnProperty('filter') && settings.filter) {
        column.filter = true;
      }
      if (!column.hasOwnProperty('width')) {
        column.width = (column.name.length * 10) + 50;
        if (column.width < 150) {
          column.width = 150;
        }
      }
      if (!column.hasOwnProperty('frozen')) {
        column.frozen = false;
      }
      if (!column.hasOwnProperty('type')) {
        if (column.hasOwnProperty('options')) {
          column.type = 'dropdown';
        } else {
          column.type = 'text';
        }
      }
      if (!column.hasOwnProperty('resizeable')) {
        column.resizeable = true;
      }
    }
    return columns;
  }

  public static getOptionName(value: any, column: Column) {
    if (column.options) {
      let name = null;
      let options;
      if (typeof column.options === 'function') {
        options = column.options();
      } else {
        options = column.options;
      }
      if (options) {
        for (const el of options) {
          if (el['id'] === value) {
            name = el['name'];
            break;
          }
        }
      }
      return name;
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

  findSelectedIndex(selectedItem: any, items: any): number {
    const obj = items.find(x => JSON.stringify(x) === JSON.stringify(selectedItem));
    const index = items.indexOf(obj);
    return index;
  }

}
