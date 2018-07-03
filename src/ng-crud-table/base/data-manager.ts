import {DataSource} from './interface';
import {Row, Filter} from '../../ng-data-table';
import {DataTable} from '../../ng-data-table/base/data-table';
import {ColumnBase} from '../../ng-data-table/base/column-base';
import {Settings} from '../../ng-data-table/base/settings';
import {Message} from '../../ng-data-table/base/message';

export class DataManager extends DataTable {

  public service: DataSource;
  public errors: any;
  public item: any;
  public isNewItem: boolean;
  public detailView: boolean;
  public formValid: boolean = true;
  public refreshRowOnSave: boolean;

  constructor(columns: ColumnBase[], settings: Settings, dataSource: DataSource, messages?: Message) {
    super(columns, settings, messages);
    this.settings.clientSide = false;
    this.setService(dataSource);
    this.refreshRowOnSave = this.columns.some(x => x.keyColumn !== undefined);
  }

  set filters(val: Filter) {
    this.dataFilter.filters = val;
    this.events.onFilter();
  }

  get filters(): Filter {
    return this.dataFilter.filters;
  }

  setService(service: DataSource) {
    this.service = service;
    if (this.settings.api) {
      this.service.url = this.settings.api;
    }
    this.service.primaryKeys = this.settings.primaryKeys;
  }

  getItems(concatRows: boolean = false): Promise<any> {
    this.events.onLoading(true);
    this.errors = null;
    this.rowGroup.setSortMetaGroup();
    if (!this.dataFilter.isGlobal) {
      this.dataFilter.globalFilterValue = null;
    }
    return this.service
      .getItems(this.pager.current, this.dataFilter.filters, this.sorter.sortMeta, this.dataFilter.globalFilterValue)
      .then(data => {
        this.events.onLoading(false);
        this.pager.total = data._meta.totalCount;
        this.pager.perPage = data._meta.perPage;
        this.rows = (concatRows) ? this.rows.concat(data.items) : data.items;
        this.pager.setCache();
        this.dataFilter.isGlobal = false;
      })
      .catch(error => {
        this.events.onLoading(false);
        this.errors = error;
      });
  }

  create(row: Row) {
    this.events.onLoading(true);
    this.errors = null;
    this.service
      .post(row)
      .then(res => {
        this.events.onLoading(false);
        this.errors = null;
        this.afterCreate(res);
        this.item = res;
      })
      .catch(error => {
        this.events.onLoading(false);
        this.errors = error;
      });
  }

  update(row: Row) {
    this.events.onLoading(true);
    this.errors = null;
    this.service.put(row)
      .then(res => {
        this.events.onLoading(false);
        this.errors = null;
        this.afterUpdate(row, res);
      })
      .catch(error => {
        this.events.onLoading(false);
        this.errors = error;
      });
  }

  delete(row: Row) {
    this.events.onLoading(true);
    this.errors = null;
    this.service
      .delete(row)
      .then(res => {
        this.events.onLoading(false);
        this.errors = null;
        this.afterDelete(row, true);
        this.item = null;
      })
      .catch(error => {
        this.events.onLoading(false);
        this.errors = error;
      });
  }

  afterCreate(result: any) {
    if (this.refreshRowOnSave) {
      this.refreshRow(result, true);
    } else {
      this.addRow(result);
    }
  }

  afterUpdate(row: Row, result: any) {
    if (this.refreshRowOnSave) {
      this.refreshRow(row, false);
    } else {
      this.mergeRow(row.uid, result);
    }
    this.events.onRowsChanged();
  }

  afterDelete(row: Row, result: boolean) {
    if (result) {
      const rowIndex: number = this.rows.findIndex(x => x.uid === row.uid);
      this.rows.splice(rowIndex, 1);
    }
  }

  mergeRow(rowUid: number, result: any) {
    const rowIndex: number = this.rows.findIndex(x => x.uid === rowUid);

    for (const key of Object.keys(result)) {
      if (key in this.rows[rowIndex]) {
        this.rows[rowIndex][key] = result[key];
      }
    }
  }

  refreshRow(row: any, isNew: boolean) {
    this.events.onLoading(true);
    this.errors = null;
    this.service.getItem(row)
      .then(data => {
        this.events.onLoading(false);
        if (isNew) {
          this.addRow(data);
        } else {
          this.mergeRow(row.uid, data);
        }
      })
      .catch(error => {
        this.events.onLoading(false);
        this.errors = error;
      });
  }

  saveRow() {
    if (this.isNewItem) {
      this.create(this.item);
    } else {
      this.update(this.item);
    }
  }

  deleteRow() {
    this.delete(this.item);
  }

  clearItem() {
    this.item = {};
    this.isNewItem = true;
  }

  setItem(row: Row) {
    this.item = Object.assign({}, row);
    this.isNewItem = false;
  }

  getSelectedRows() {
    return this.dataSelection.getSelectedRows(this.rows);
  }

  clear() {
    this.rows = [];
    this.pager.total = 0;
    this.detailView = false;
  }

}
