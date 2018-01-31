import {Column, Settings, MenuItem, Filter, SortMeta} from '../types';
import {ColumnModel} from './column.model';
import {isBlank} from '../utils/util';

export class DataTable {

  public settings: Settings;
  public columns: ColumnModel[] = [];
  public actionColumnWidth: number = 40;
  public columnsTotalWidth: number;
  public frozenColumns: ColumnModel[] = [];
  public scrollableColumns: ColumnModel[] = [];
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

  constructor(columns?: Column[], settings?: Settings) {
    this.defaultSettings();
    if (columns) {
      this.createColumns(columns);
    }
    if (settings) {
      this.setSettings(settings);
    }
  }

  createColumns(columns: Column[]) {
    for (const column of columns) {
      this.columns.push(new ColumnModel(column));
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

  defaultSettings() {
    this.settings = {
      api: null,
      crud: false,
      sortable: true,
      filter: true,
      initLoad: true,
      messages: {
        empty: 'No data to display',
        loading: 'Loading...',
        clearFilters: 'Clear all filters',
        create: 'Create',
        delete: 'Delete',
        save: 'Save',
        close: 'Close',
        titleCreate: 'Create',
        titleUpdate: 'Update',
        titleDetailView: 'Detail view',
        search: 'Search...',
        selectAll: 'Select all',
        clear: 'Clear',
        equals: 'Equals',
        notEqual: 'Does not equal',
        lessThan: 'Is less than',
        lessThanOrEqual: 'Is less than or equal to',
        greaterThan: 'Is greater than',
        greaterThanOrEqual: 'Is greater than or equal to',
        inRange: 'In range',
        contains: 'Contains',
        notContains: 'Does not contain',
        startsWith: 'Begins with',
        endsWith: 'Ends with'
      }
    };
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

  setColumnWidth(column: ColumnModel, width: number) {
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

  isFilter(column: ColumnModel): boolean {
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

  getFilterValue(column: ColumnModel) {
    return this.filters[column.name] ? this.filters[column.name].value : null;
  }

  getFilterValueTo(column: ColumnModel) {
    return this.filters[column.name] ? this.filters[column.name].valueTo : null;
  }

  getFilterMatchMode(column: ColumnModel) {
    return this.filters[column.name] ? this.filters[column.name].matchMode : null;
  }

  setSortOrder(column: ColumnModel) {
    this.sortMeta.order = (this.sortMeta.field === column.name) ? this.sortMeta.order * -1 : 1;
    this.sortMeta.field = column.name;
  }

  getSortOrder(column: ColumnModel) {
    let order = 0;
    if (this.sortMeta.field && this.sortMeta.field === column.name) {
      order = this.sortMeta.order;
    }
    return order;
  }

}
