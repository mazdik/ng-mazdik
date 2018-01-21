import {Column, Settings, MenuItem} from '../types';
import {ColumnModel} from './column.model';

export class DataTable {

  public settings: Settings;
  public columns: ColumnModel[] = [];
  public headerHeight: number = 30;
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

  constructor(columns?: Column[], settings?: Settings) {
    this.settings = {
      api: null,
      crud: false,
      sortable: true,
      filter: true,
      initLoad: true
    };
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

  setSettings(settings: Settings) {
    this.settings = settings;
    this.settings.sortable = (this.settings.hasOwnProperty('sortable')) ? this.settings.sortable : true;
    this.settings.filter = (this.settings.hasOwnProperty('filter')) ? this.settings.filter : true;
    this.settings.initLoad = (this.settings.initLoad !== undefined) ? this.settings.initLoad : true;
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
    this.scrollHeight = this.settings.scrollHeight;
  }

  setColumnWidth(column: ColumnModel, newValue: number) {
    for (const col of this.columns) {
      if (col.name === column.name) {
        col.width = newValue;
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

}
