import {Row, CellEventArgs} from './types';
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
import {Sequence} from './sequence';

export class DataTable {

  settings: Settings;
  messages?: Message;
  sequence: Sequence;
  columns: Column[] = [];
  frozenColumns: Column[] = [];
  scrollableColumns: Column[] = [];
  pager: DataPager;
  sorter: DataSort;
  dataFilter: DataFilter;
  events: Events;
  selection: DataSelection;
  dimensions: Dimensions;
  rowGroup: RowGroup;
  rowVirtual: RowVirtual;
  localRows: Row[] = [];

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
    this.selection = new DataSelection(this.settings.selectionMultiple, this.events);
    this.dimensions = new Dimensions(this.settings, this.columns);
    this.rowGroup = new RowGroup(this.settings, this.sorter, this.columns);
    this.rowVirtual = new RowVirtual(this.settings, this.pager, this.dimensions, this.events);
    if (messages) {
      Object.assign(this.messages, messages);
    }
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

  getRows() {
    if (this.settings.virtualScroll) {
      return this.rowVirtual.virtualRows;
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
      this.selection.selectRow(rowIndex);
    } else {
      this.selection.clearSelection();
    }
  }

  columnTrackingFn(index: number, column: Column): any {
    return column.name;
  }

  chunkRows(force: boolean = false) {
    this.rowVirtual.chunkRows(this._rows, force);
  }

  addRow(newRow: Row) {
    newRow = this.generateRow(newRow);
    this._rows.push(newRow);

    if (this.settings.clientSide) {
      this.localRows.push(newRow);
      this.getLocalRows();
    } else {
      this.rowGroup.updateRowGroupMetadata(this._rows);
      this.pager.total += 1;
    }
    this._rows = this.sequence.setRowIndexes(this._rows);
    this.chunkRows(true);
    this.events.onRowsChanged();
    setTimeout(() => {
      this.events.onActivateCell(<CellEventArgs>{columnIndex: 0, rowIndex: newRow.$$index});
    }, 10);
  }

  deleteRow(row: Row) {
    let rowIndex = this.rows.findIndex(x => x.$$uid === row.$$uid);
    this._rows.splice(rowIndex, 1);

    if (this.settings.clientSide) {
      rowIndex = this.localRows.findIndex(x => x.$$uid === row.$$uid);
      this.localRows.splice(rowIndex, 1);
      this.getLocalRows();
    } else {
      this.rowGroup.updateRowGroupMetadata(this._rows);
      this.pager.total -= 1;
    }
    this._rows = this.sequence.setRowIndexes(this._rows);
    this.chunkRows(true);
    this.events.onRowsChanged();
  }

  mergeRow(oldRow: Row, newRow: any) {
    const rowIndex = this.rows.findIndex(x => x.$$uid === oldRow.$$uid);

    for (const key of Object.keys(newRow)) {
      if (key in this.rows[rowIndex]) {
        this.rows[rowIndex][key] = newRow[key];
      }
    }
    this.rows[rowIndex] = this.generateRow(this.rows[rowIndex]);
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
    if (!row.$$uid) {
      row.$$uid = this.sequence.getUidRow();
    }
    row.$$data = Object.assign({}, row);
    if (!row.$$height) {
      row.$$height = this.dimensions.rowHeight;
    }
    this.columns.forEach((column) => {
      if (column.containsDots) {
        row[column.name] = column.getDeepValue(row, column.name);
      }
    });
    return row;
  }

  revertRowChanges(row: Row) {
    this.columns.forEach((column) => {
      this.rows[row.$$index][column.name] = this.rows[row.$$index].$$data[column.name];
    });
    this.events.onRowsChanged();
  }

  rowChanged(row: Row): boolean {
    return this.columns.some(x => row[x.name] !== row.$$data[x.name]);
  }

  cloneRow(row: Row): Row {
    const newRow = Object.assign({}, row);
    newRow.$$uid = null;
    newRow.$$index = null;
    newRow.$$data = null;
    return newRow;
  }

  getSelection() {
    return this.selection.getSelectedRows(this.rows);
  }

}
