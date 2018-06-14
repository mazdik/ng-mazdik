import {MenuItem, Row} from '../types';
import {ColumnBase} from './column-base';
import {Column} from './column';
import {Settings} from './settings';
import {DataPager} from './data-pager';
import {DataSort} from './data-sort';
import {DataFilter} from './data-filter';
import {Events} from './events';
import {DataSelection} from './data-selection';
import {Dimensions} from './dimensions';
import {Message} from './message';
import {getUidRow} from './util';
import {RowGroup} from './row-group';

export class DataTable {

  public settings: Settings;
  public messages?: Message;
  public columns: Column[] = [];
  public frozenColumns: Column[] = [];
  public scrollableColumns: Column[] = [];
  public actionMenu: MenuItem[];
  public pager: DataPager;
  public sorter: DataSort;
  public dataFilter: DataFilter;
  public events: Events;
  public dataSelection: DataSelection;
  public dimensions: Dimensions;
  public rowGroup: RowGroup;
  public localRows: Row[] = [];
  public virtualRows: Row[] = [];
  public offsetX: number = 0;
  public offsetY: number = 0;

  private start: number;
  private end: number;
  private previousStart: number;
  private previousEnd: number;

  set rows(val: any) {
    val = this.setRowUid(val);
    if (this.settings.clientSide) {
      this.setLocalRows(val);
      this.getLocalRows();
    } else {
      this._rows = val;
      this.rowGroup.updateRowGroupMetadata(this._rows);
    }
    this.setRowIndexes();
    this.chunkRows(true);
    this.events.onRowsChanged();
  }

  get rows(): any {
    return this._rows;
  }

  private _rows: Row[] = [];

  constructor(columns: ColumnBase[], settings: Settings, messages?: Message) {
    this.settings = new Settings(settings);
    this.messages = new Message();
    this.createColumns(columns);
    this.events = new Events();
    this.pager = new DataPager();
    this.sorter = new DataSort(this.settings);
    this.dataFilter = new DataFilter();
    this.dataSelection = new DataSelection(this.settings, this.events);
    this.dimensions = new Dimensions(this.settings, this.columns);
    this.rowGroup = new RowGroup(this.settings, this.sorter, this.columns);
    if (messages) {
      Object.assign(this.messages, messages);
    }
    this.setShareSettings();
  }

  createColumns(columns: ColumnBase[]) {
    for (const column of columns) {
      this.columns.push(new Column(column, this.settings));
    }
    this.initColumns();
  }

  initColumns(): void {
    this.frozenColumns = [];
    this.scrollableColumns = [];

    this.columns.forEach((column) => {
      if (!column.tableHidden) {
        if (column.frozen) {
          this.frozenColumns.push(column);
        } else {
          this.scrollableColumns.push(column);
        }
      }
    });
    this.setColumnIndexes();
  }

  setShareSettings() {
    if (!this.actionMenu && !this.settings.selectionMode && !this.settings.rowNumber) {
      this.dimensions.actionColumnWidth = 0;
    }
  }

  getRows() {
    if (this.settings.virtualScroll) {
      return this.virtualRows;
    } else {
      return this._rows;
    }
  }

  setLocalRows(data: Row[]) {
    this.dataFilter.clear();
    this.sorter.clear();
    this.pager.current = 1;
    this.localRows = (data) ? data.slice(0) : [];
  }

  getLocalRows(): void {
    if (this.localRows) {
      const data = this.dataFilter.filterRows(this.localRows);
      this.pager.total = data.length;
      this.rowGroup.setSortMetaGroup();
      this._rows = this.sorter.sortRows(data);
      if (!this.settings.virtualScroll) {
        this._rows = this.pager.pager(this._rows);
      }
      this.setRowIndexes();
      this.rowGroup.updateRowGroupMetadata(this._rows);
    }
  }

  selectRow(rowIndex: number) {
    if (this.rows && this.rows.length) {
      this.dataSelection.selectRow(rowIndex);
    } else {
      this.dataSelection.clearRowSelection();
    }
  }

  clearSelection() {
    this.dataSelection.clearRowSelection();
  }

  columnTrackingFn(index: number, column: Column): any {
    return column.name;
  }

  getSelectedRowIndex() {
    return this.dataSelection.selectedRowIndex;
  }

  chunkRows(force: boolean = false) {
    if (this.settings.virtualScroll && !this.dimensions.bodyHeight) {
      this.dimensions.calcBodyHeight(this.pager.perPage);
    }
    if (this.settings.virtualScroll) {
      this.pager.total = this.rows.length;
      const totalRecords = this.pager.total;
      this.dimensions.calcScrollHeight(totalRecords);

      this.start = Math.floor(this.offsetY / this.dimensions.rowHeight);
      this.end = Math.min(totalRecords, this.start + this.pager.perPage + 1);

      if (this.start !== this.previousStart || this.end !== this.previousEnd || force === true) {
        this.virtualRows = this._rows.slice(this.start, this.end);
        this.previousStart = this.start;
        this.previousEnd = this.end;
      }
    }
  }

  setColumnIndexes() {
    let columnIndex = 0;
    this.columns.forEach(column => {
      if (!column.tableHidden) {
        column.index = columnIndex++;
      }
    });
  }

  setRowIndexes() {
    let rowIndex = 0;
    this._rows.forEach(row => {
      row.index = rowIndex++;
    });
  }

  setRowUid(data: Row[]): Row[] {
    data.forEach(row => {
      if (!row.uid) {
        row.uid = getUidRow();
      }
    });
    return data;
  }

  updatePage(direction: string): void {
    if (this.settings.virtualScroll && direction) {
      let page = this.start / this.pager.perPage;
      if (direction === 'up') {
        page = Math.floor(page);
      } else if (direction === 'down') {
        page = Math.ceil(page);
      }
      page += 1;
      if (page !== this.pager.current) {
        this.pager.current = page;
        this.events.onPage();
      }
    }
  }

  resetPositionChunkRows() {
    this.start = 0;
    this.end = 0;
    this.previousStart = 0;
    this.previousEnd = 0;
  }

  addRow(newRow: Row) {
    newRow.uid = getUidRow();
    this._rows.push(newRow);

    if (this.settings.clientSide) {
      this.localRows.push(newRow);
      this.getLocalRows();
    } else {
      this.rowGroup.updateRowGroupMetadata(this._rows);
    }
    this.setRowIndexes();
    this.chunkRows(true);
    this.events.onRowsChanged();
  }

}
