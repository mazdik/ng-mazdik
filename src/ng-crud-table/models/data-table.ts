import {MenuItem, Filter, SortMeta} from '../types';
import {ColumnBase} from './column-base';
import {Column} from './column';
import {Settings} from './settings';
import {isBlank} from '../utils/util';

export class DataTable {

  public settings: Settings;
  public columns: Column[] = [];
  public actionColumnWidth: number = 40;
  public columnsTotalWidth: number;
  public frozenColumns: Column[] = [];
  public scrollableColumns: Column[] = [];
  public frozenWidth: number = 0;
  public scrollableColumnsWidth: number = 0;
  public minWidthColumn: number = 50;
  public maxWidthColumn: number = 500;
  public scrollHeight: number;
  public tableWidth: number;
  public actionMenu: MenuItem[];
  public filters: Filter = <Filter>{};
  public sortMeta: SortMeta = <SortMeta>{};
  public columnMenuWidth: number = 200;
  public filterDelay: number = 500;

  constructor(columns?: ColumnBase[], settings?: Settings) {
    this.settings = new Settings(settings);
    if (columns) {
      this.createColumns(columns);
    }
    if (settings) {
      this.setSettings(settings);
    }
  }

  createColumns(columns: ColumnBase[]) {
    for (const column of columns) {
      this.columns.push(new Column(column));
    }
    this.initColumns();
    this.calcColumnsTotalWidth();
  }

  initColumns(): void {
    this.columns.forEach((column) => {
      if (!column.tableHidden) {
        if (column.frozen) {
          this.frozenColumns.push(column);
          this.frozenWidth = this.frozenWidth + column.width;
        } else {
          this.scrollableColumns.push(column);
          this.scrollableColumnsWidth = this.scrollableColumnsWidth + column.width;
        }
      }
    });
  }

  setSettings(settings: Settings) {
    const messages = Object.assign({}, this.settings.messages, settings.messages);
    Object.assign(this.settings, settings, {messages: messages});

    /* disable all sorts */
    if (this.settings.sortable === false) {
      for (const col of this.columns) {
        col.sortable = false;
      }
    }
    /* disable all filters */
    if (this.settings.filter === false) {
      for (const col of this.columns) {
        col.filter = false;
      }
    }
    this.tableWidth = this.settings.tableWidth;
    if (!this.tableWidth && this.columnsTotalWidth < 800) {
      this.tableWidth = this.columnsTotalWidth;
    }
    this.scrollHeight = this.settings.scrollHeight;
  }

  setColumnWidth(column: Column, width: number) {
    if (width <= this.minWidthColumn) {
      width = this.minWidthColumn;
    } else if (width >= this.maxWidthColumn) {
      width = this.maxWidthColumn;
    }
    for (const col of this.columns) {
      if (col.name === column.name) {
        col.width = width;
      }
    }
  }

  calcColumnsTotalWidth() {
    let totalWidth = 0;
    for (const column of this.columns) {
      if (!column.tableHidden) {
        totalWidth = totalWidth + column.width;
      }
    }
    this.columnsTotalWidth = totalWidth + this.actionColumnWidth;
  }

  isFilter(column: Column): boolean {
    return !isBlank(this.filters[column.name]);
  }

  hasFilter() {
    let empty = true;
    for (const prop in this.filters) {
      if (this.filters.hasOwnProperty(prop)) {
        empty = false;
        break;
      }
    }
    return !empty;
  }

  setFilter(value: any, field: string, matchMode: string, valueTo?: any, type?: string) {
    if (!isBlank(value) || !isBlank(valueTo)) {
      this.filters[field] = {value: value, matchMode: matchMode, valueTo: valueTo, type: type};
    } else if (this.filters[field]) {
      delete this.filters[field];
    }
  }

  getFilterValue(column: Column) {
    return this.filters[column.name] ? this.filters[column.name].value : null;
  }

  getFilterValueTo(column: Column) {
    return this.filters[column.name] ? this.filters[column.name].valueTo : null;
  }

  getFilterMatchMode(column: Column) {
    return this.filters[column.name] ? this.filters[column.name].matchMode : null;
  }

  setSortOrder(column: Column) {
    this.sortMeta.order = (this.sortMeta.field === column.name) ? this.sortMeta.order * -1 : 1;
    this.sortMeta.field = column.name;
  }

  getSortOrder(column: Column) {
    let order = 0;
    if (this.sortMeta.field && this.sortMeta.field === column.name) {
      order = this.sortMeta.order;
    }
    return order;
  }

}
