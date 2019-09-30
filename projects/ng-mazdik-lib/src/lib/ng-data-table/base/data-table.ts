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
import {DtMessages, DtMessagesEn} from '../../dt-translate/dt-messages';
import {RowGroup} from './row-group';
import {RowModelGenerator} from './row-model-generator';
import {ColumnModelGenerator} from './column-model-generator';
import {LocalDataSource} from './local-data-source';
import {Row} from './row';

export class DataTable {

  readonly settings: Settings;
  readonly messages: DtMessages;
  readonly pager: DataPager;
  readonly sorter: DataSort;
  readonly dataFilter: DataFilter;
  readonly events: Events;
  readonly selection: DataSelection<number>;
  readonly dimensions: Dimensions;
  readonly rowGroup: RowGroup;
  readonly localDataSource: LocalDataSource;
  readonly rowModelGenerator: RowModelGenerator;
  readonly columnModelGenerator: ColumnModelGenerator;
  readonly columns: Column[] = [];
  preparedColumns: Column[] = [];
  clientSide: boolean = true;

  get rows(): any[] { return this._rows; }
  set rows(val: any[]) {
    val = this.rowModelGenerator.generateRows(val);
    if (this.clientSide) {
      this.localDataSource.setRows(val);
      this.setSortMetaGroup();
      this._rows = this.localDataSource.getRows();
    } else {
      this._rows = val;
    }
    this.rowGroup.updateRowGroupMetadata(this._rows);
    this.rowModelGenerator.setRowIndexes(this._rows);
    this.events.onRowsChanged();
  }
  private _rows: Row[] = [];

  constructor(columns: ColumnBase[], settings: Settings, messages?: DtMessages) {
    this.settings = new Settings(settings);
    this.dataFilter = new DataFilter();
    this.columnModelGenerator = new ColumnModelGenerator(this.settings);
    this.columns = this.columnModelGenerator.createColumns(columns);
    this.initColumns();
    this.events = new Events();
    this.pager = new DataPager();
    this.sorter = new DataSort(this.settings.multipleSort);
    this.selection = new DataSelection(this.settings.selectionMultiple, this.events.selectionSource);
    this.dimensions = new Dimensions(this.settings, this.columns);
    this.rowGroup = new RowGroup(this.settings.groupRowsBy, this.columns);
    this.localDataSource = new LocalDataSource(this.dataFilter, this.pager, this.sorter, this.settings);
    this.rowModelGenerator = new RowModelGenerator(this.settings, this.columns);
    this.messages = new DtMessagesEn();
    if (messages) {
      Object.assign(this.messages, messages);
    }
  }

  initColumns(): void {
    this.preparedColumns = this.columnModelGenerator.prepareColumns(this.columns);
  }

  selectRow(rowIndex: number) {
    if (this.rows && this.rows.length) {
      this.selection.selectValue(rowIndex);
    } else {
      this.selection.clearSelection();
    }
  }

  addRow(newRow: any) {
    newRow = this.rowModelGenerator.generateRow(newRow);

    if (this.clientSide) {
      this.localDataSource.post(newRow);
      this._rows = this.localDataSource.getRows();
    } else {
      this._rows.push(newRow);
      this.pager.total += 1;
    }
    this.rowGroup.updateRowGroupMetadata(this._rows);
    this.rowModelGenerator.setRowIndexes(this._rows);
    this.events.onRowsChanged();
    setTimeout(() => {
      this.events.onActivateCell({columnIndex: 0, rowIndex: newRow.$$index} as CellEventArgs);
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
    this.rowModelGenerator.setRowIndexes(this._rows);
    this.events.onRowsChanged();
  }

  mergeRow(oldRow: Row, newRow: any) {
    oldRow.merge(newRow);
    this.events.onRowsChanged();
  }

  editCell(rowIndex: number, columnIndex: number, editMode: boolean) {
    this.events.onCellEditMode({columnIndex, rowIndex, editMode} as CellEventArgs);
  }

  revertRowChanges(row: Row) {
    row.revertChanges(this.columns);
    this.events.onRowsChanged();
  }

  rowChanged(row: Row): boolean {
    return this.columns.some(x => x.getValue(row) !== x.getValue(row.$$data));
  }

  getSelection() {
    return this.selection.getSelection().map(x => this.rows[x]);
  }

  loadLocalRows() {
    this._rows = this.localDataSource.getRows();
    this.rowGroup.updateRowGroupMetadata(this._rows);
    this.rowModelGenerator.setRowIndexes(this._rows);
  }

  protected setSortMetaGroup() {
    if (this.rowGroup.groupEnabled) {
      this.sorter.multiple = true;
      this.sorter.set(this.rowGroup.groupRowsBy);
    }
  }

  allRowsSelected(): boolean {
    const selectedIndexes = this.rows.map(x => x.$$index);
    return this.selection.allSelected(selectedIndexes);
  }

  partiallySelected(): boolean {
    return !this.selection.isEmpty() && !this.allRowsSelected();
  }

  selectAllRows() {
    if (this.allRowsSelected()) {
      this.selection.clearSelection();
    } else {
      const selectedIndexes = this.rows.map(x => x.$$index);
      this.selection.selectAll(selectedIndexes);
    }
  }

}
