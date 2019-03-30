import {CellEventArgs} from './types';
import {ColumnBase} from './column-base';
import {Column} from './column';
import {Settings} from './settings';
import {DataPager} from './data-pager';
import {DataSort} from './data-sort';
import {DataFilter} from './data-filter';
import {Events} from './events';
import {DataSelection} from './data-selection';
import {Dimensions} from './dimensions';
import {DtMessages} from '../../dt-translate';
import {RowGroup} from './row-group';
import {Sequence} from './sequence';
import {LocalDataSource} from './local-data-source';
import {Row} from './row';

export class DataTable {

  settings: Settings;
  messages: DtMessages = new DtMessages();
  sequence: Sequence;
  columns: Column[] = [];
  frozenColumns: Column[] = [];
  scrollableColumns: Column[] = [];
  pager: DataPager;
  sorter: DataSort;
  dataFilter: DataFilter;
  events: Events;
  selection: DataSelection<number>;
  dimensions: Dimensions;
  rowGroup: RowGroup;
  localDataSource: LocalDataSource;
  clientSide: boolean = true;

  get rows(): any { return this._rows; }
  set rows(val: any) {
    val = val.map(this.generateRow.bind(this));
    if (this.clientSide) {
      this.localDataSource.setRows(val);
      this.setSortMetaGroup();
      this._rows = this.localDataSource.getRows();
    } else {
      this._rows = val;
    }
    this.rowGroup.updateRowGroupMetadata(this._rows);
    this._rows = this.sequence.setRowIndexes(this._rows);
    this.events.onRowsChanged();
  }
  private _rows: Row[] = [];

  constructor(columns: ColumnBase[], settings: Settings, messages?: DtMessages) {
    this.settings = new Settings(settings);
    this.sequence = new Sequence();
    this.dataFilter = new DataFilter();
    this.createColumns(columns);
    this.events = new Events();
    this.pager = new DataPager();
    this.sorter = new DataSort(this.settings.multipleSort);
    this.selection = new DataSelection(this.settings.selectionMultiple, this.events.selectionSource);
    this.dimensions = new Dimensions(this.settings, this.columns);
    this.rowGroup = new RowGroup(this.settings, this.columns);
    this.localDataSource = new LocalDataSource(this.dataFilter, this.pager, this.sorter, this.settings);
    if (messages) {
      Object.assign(this.messages, messages);
    }
  }

  createColumns(columns: ColumnBase[]) {
    this.columns = columns.map(column => new Column(column, this.settings, this.dataFilter));
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

  selectRow(rowIndex: number) {
    if (this.rows && this.rows.length) {
      this.selection.selectValue(rowIndex);
    } else {
      this.selection.clearSelection();
    }
  }

  addRow(newRow: any) {
    newRow = this.generateRow(newRow);

    if (this.clientSide) {
      this.localDataSource.post(newRow);
      this._rows = this.localDataSource.getRows();
    } else {
      this._rows.push(newRow);
      this.pager.total += 1;
    }
    this.rowGroup.updateRowGroupMetadata(this._rows);
    this._rows = this.sequence.setRowIndexes(this._rows);
    this.events.onRowsChanged();
    setTimeout(() => {
      this.events.onActivateCell(<CellEventArgs>{columnIndex: 0, rowIndex: newRow.$$index});
    }, 10);
  }

  deleteRow(row: Row) {
    if (this.clientSide) {
      this.localDataSource.delete(row);
      this._rows = this.localDataSource.getRows();
    } else {
      const rowIndex = this.rows.findIndex(x => x.$$uid === row.$$uid);
      this._rows.splice(rowIndex, 1);
      this.pager.total -= 1;
    }
    this.rowGroup.updateRowGroupMetadata(this._rows);
    this._rows = this.sequence.setRowIndexes(this._rows);
    this.events.onRowsChanged();
  }

  mergeRow(oldRow: Row, newRow: any) {
    let row = this.rows.find(x => x.$$uid === oldRow.$$uid);

    Object.keys(newRow).forEach(key => {
      if (key in row) {
        row[key] = newRow[key];
      }
    });
    row = this.generateRow(row);
    this.events.onRowsChanged();
  }

  editCell(rowIndex: number, columnIndex: number, editMode: boolean) {
    this.events.onCellEditMode(<CellEventArgs>{columnIndex, rowIndex, editMode});
  }

  private generateRow(row: any): Row {
    if (!(row instanceof Row)) {
      row = new Row(row);
    }
    this.columns.forEach((column) => {
      if (column.containsDots) {
        row[column.name] = column.getValue(row);
      }
    });
    if (!row.$$uid) {
      row.$$uid = this.sequence.getUidRow();
    }
    row.$$data = Object.assign({}, row);
    return row;
  }

  revertRowChanges(row: Row) {
    this.columns.forEach((column) => {
      this.rows[row.$$index][column.name] = this.rows[row.$$index].$$data[column.name];
    });
    this.events.onRowsChanged();
  }

  rowChanged(row: Row): boolean {
    return this.columns.some(x => x.getValue(row) !== x.getValue(row.$$data));
  }

  cloneRow(row: Row): Row {
    const newRow = Object.assign({}, row);
    newRow.$$uid = null;
    newRow.$$index = null;
    newRow.$$data = null;
    return newRow;
  }

  getSelection() {
    return this.selection.getSelection().map(x => this.rows[x]);
  }

  loadLocalRows() {
    this._rows = this.localDataSource.getRows();
    this.rowGroup.updateRowGroupMetadata(this._rows);
    this._rows = this.sequence.setRowIndexes(this._rows);
  }

  protected setSortMetaGroup() {
    if (this.rowGroup.groupEnabled) {
      this.sorter.multiple = true;
      this.sorter.set(this.rowGroup.groupRowsBy);
    }
  }

}
