import {MenuItem, Row, CellEventArgs} from '../types';
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
import {RowGroup} from './row-group';
import {RowVirtual} from './row-virtual';
import {Export} from './export';
import {Sequence} from './sequence';

export class DataTable {

  public settings: Settings;
  public messages?: Message;
  public sequence: Sequence;
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
  public rowVirtual: RowVirtual;
  public export: Export;
  public localRows: Row[] = [];
  public virtualRows: Row[] = [];
  public offsetX: number = 0;
  public offsetY: number = 0;

  set rows(val: any) {
    val = val.map(this.generateRow.bind(this));
    if (this.settings.clientSide) {
      this.setLocalRows(val);
      this.getLocalRows();
    } else {
      this._rows = val;
      this.rowGroup.updateRowGroupMetadata(this._rows);
    }
    this._rows = this.sequence.setRowIndexes(this._rows);
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
    this.sequence = new Sequence();
    this.createColumns(columns);
    this.events = new Events();
    this.pager = new DataPager();
    this.sorter = new DataSort(this.settings);
    this.dataFilter = new DataFilter();
    this.dataSelection = new DataSelection(this.settings, this.events);
    this.dimensions = new Dimensions(this.settings, this.columns);
    this.rowGroup = new RowGroup(this.settings, this.sorter, this.columns);
    this.rowVirtual = new RowVirtual(this.settings, this.pager, this.dimensions, this.events);
    this.export = new Export();
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
    this.columns = this.sequence.setColumnIndexes(this.columns);
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
      this._rows = this.sequence.setRowIndexes(this._rows);
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
    const virtualRows = this.rowVirtual.chunkRows(this._rows, this.offsetY, force);
    if (virtualRows && virtualRows.length) {
      this.virtualRows = virtualRows;
    }
  }

  addRow(newRow: Row) {
    newRow = this.generateRow(newRow);
    this._rows.push(newRow);

    if (this.settings.clientSide) {
      this.localRows.push(newRow);
      this.getLocalRows();
    } else {
      this.rowGroup.updateRowGroupMetadata(this._rows);
    }
    this._rows = this.sequence.setRowIndexes(this._rows);
    this.chunkRows(true);
    this.events.onRowsChanged();
  }

  editCell(rowIndex: number, columnIndex: number, editMode: boolean) {
    this.events.onCellEditMode(<CellEventArgs>{columnIndex, rowIndex, editMode});
  }

  updateCell(rowIndex: number, field: string, value: string | number | boolean | Date): void {
    this.rows[rowIndex][field] = value;
    this.events.onRowsChanged();
  }

  protected generateRow(row: Row): Row {
    if (!row.uid) {
      row.uid = this.sequence.getUidRow();
    }
    row.$$data = Object.assign({}, row);
    return row;
  }

}
