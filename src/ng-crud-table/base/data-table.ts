import {MenuItem} from '../types';
import {ColumnBase} from './column-base';
import {Column} from './column';
import {Settings} from './settings';
import {DataPager} from './data-pager';
import {DataSort} from './data-sort';
import {DataFilter} from './data-filter';
import {DataService} from './data-service';
import {DataAggregation} from './data-aggregation';
import {DataSelection} from './data-selection';

export class DataTable {

  public settings: Settings;
  public columns: Column[] = [];
  public actionColumnWidth: number = 40;
  public columnsTotalWidth: number;
  public frozenColumns: Column[] = [];
  public scrollableColumns: Column[] = [];
  public frozenWidth: number = 0;
  public scrollableColumnsWidth: number = 0;
  public scrollHeight: number;
  public tableWidth: number;
  public actionMenu: MenuItem[];
  public columnMenuWidth: number = 200;
  public pager: DataPager;
  public sorter: DataSort;
  public dataFilter: DataFilter;
  public dataService: DataService;
  public dataAggregation: DataAggregation;
  public dataSelection: DataSelection;
  public localRows: any[];
  public rowGroupMetadata: any;
  public grandTotalRow: any;
  public offsetX: number = 0;
  public offsetY: number = 0;

  set rows(val: any) {
    if (this.settings.clientSide) {
      this.setLocalRows(val);
      this.getLocalRows();
    } else {
      this._rows = val;
      this.updateRowGroupMetadata();
    }
    this.dataService.onRows();
  }

  get rows(): any {
    return this._rows;
  }

  private _rows: any[];

  constructor(columns?: ColumnBase[], settings?: Settings) {
    this.settings = new Settings(settings);
    this.pager = new DataPager();
    this.sorter = new DataSort();
    this.dataFilter = new DataFilter();
    this.dataService = new DataService();
    this.dataAggregation = new DataAggregation();
    this.dataSelection = new DataSelection();
    this.sorter.multiple = this.settings.multipleSort;
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
      if (column.aggregation) {
        this.dataAggregation.aggregates.push({field: column.name, type: column.aggregation});
      }
    }
    this.initColumns();
    this.calcColumnsTotalWidth();
  }

  initColumns(): void {
    this.frozenColumns = [];
    this.scrollableColumns = [];

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
    this.sorter.multiple = this.settings.multipleSort;
    this.dataSelection.type = this.settings.selectionType;
    this.hideRowGroupColumns();
    this.initColumns();
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

  setLocalRows(data: any[]) {
    this.dataFilter.clear();
    this.sorter.clear();
    this.pager.current = 1;
    this.localRows = (data) ? data.slice(0) : [];
  }

  getLocalRows(): void {
    if (this.localRows) {
      let data = this.dataFilter.filterRows(this.localRows);
      this.pager.total = data.length;
      this.setSortMetaGroup();
      data = this.sorter.sortRows(data);
      this._rows = this.pager.pager(data);
      this.updateRowGroupMetadata();
    }
  }

  selectRow(rowIndex: number) {
    if (this.rows && this.rows.length) {
      this.dataSelection.selectRow(rowIndex);
    } else {
      this.dataSelection.clearRowSelection();
    }
    this.dataService.onSelectionChange();
  }

  setSortMetaGroup() {
    if (this.settings.groupRowsBy && this.settings.groupRowsBy.length) {
      this.sorter.multiple = true;
      this.settings.groupRowsBy.forEach(columnName => {
        this.sorter.sortMeta.push({field: columnName, order: 1});
      });
    }
  }

  updateRowGroupMetadata() {
    if (this.settings.groupRowsBy && this.settings.groupRowsBy.length) {
      this.rowGroupMetadata = this.dataAggregation.groupMetaData(this.rows, this.settings.groupRowsBy);
    }
    if (this.dataAggregation.enabled) {
      this.grandTotalRow = this.dataAggregation.grandTotal(this.rows);
    }
  }

  getRowGroupName(row: any) {
    return this.dataAggregation.groupStringValues(row, this.settings.groupRowsBy);
  }

  getRowGroupSize(row: any) {
    const group = this.dataAggregation.groupStringValues(row, this.settings.groupRowsBy);
    return this.rowGroupMetadata[group].size;
  }

  isRowGroup(row: any, rowIndex: number) {
    if (this.settings.groupRowsBy && this.settings.groupRowsBy.length) {
      const group = this.dataAggregation.groupStringValues(row, this.settings.groupRowsBy);
      return this.rowGroupMetadata[group].index === rowIndex;
    } else {
      return false;
    }
  }

  isRowGroupSummary(row: any, rowIndex: number) {
    if (this.settings.groupRowsBy && this.settings.groupRowsBy.length && this.dataAggregation.aggregates.length) {
      const group = this.dataAggregation.groupStringValues(row, this.settings.groupRowsBy);
      const lastRowIndex = (this.rowGroupMetadata[group].index + this.rowGroupMetadata[group].size) - 1;
      return lastRowIndex === rowIndex;
    } else {
      return false;
    }
  }

  getRowGroupSummary(row: any) {
    const group = this.dataAggregation.groupStringValues(row, this.settings.groupRowsBy);
    const summaryRow = Object.assign({}, this.rowGroupMetadata[group]);
    delete summaryRow.index;
    delete summaryRow.size;
    return summaryRow;
  }

  hideRowGroupColumns() {
    if (this.settings.groupRowsBy && this.settings.groupRowsBy.length) {
      this.columns.forEach((column, index) => {
        if (this.settings.groupRowsBy.indexOf(column.name) >= 0) {
          this.columns[index].tableHidden = true;
        }
      });
    }
  }

  columnTrackingFn(index: number, column: Column): any {
    return column.name;
  }

  getSelectedRowIndex() {
    return this.dataSelection.selectedRowIndex;
  }

}
