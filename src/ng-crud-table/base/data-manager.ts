import {DataSource, Filter, Row} from '../types';
import {DataTable} from './data-table';
import {ColumnBase} from './column-base';
import {Settings} from './settings';
import {Message} from './message';

export class DataManager extends DataTable {

  public service: DataSource;
  public errors: any;
  public loading: boolean;
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
    this.loading = true;
    this.errors = null;
    this.setSortMetaGroup();
    const globalFilterValue = this.dataFilter.isGlobal ? this.dataFilter.globalFilterValue : null;
    if (!this.dataFilter.isGlobal) {
      this.dataFilter.globalFilterValue = null;
    }
    return this.service
      .getItems(this.pager.current, this.dataFilter.filters, this.sorter.sortMeta, globalFilterValue)
      .then(data => {
        this.loading = false;
        this.pager.total = data._meta.totalCount;
        this.pager.perPage = data._meta.perPage;
        this.rows = (concatRows) ? this.rows.concat(data.items) : data.items;
        this.pager.setCache();
        this.dataFilter.isGlobal = false;
      })
      .catch(error => {
        this.loading = false;
        this.errors = error;
      });
  }

  create(row: any) {
    this.loading = true;
    this.errors = null;
    this.service
      .post(row)
      .then(res => {
        this.loading = false;
        this.errors = null;
        this.afterCreate(res);
        this.item = res;
      })
      .catch(error => {
        this.loading = false;
        this.errors = error;
      });
  }

  update(row: any) {
    this.loading = true;
    this.errors = null;
    this.service.put(row)
      .then(res => {
        this.loading = false;
        this.errors = null;
        this.afterUpdate(res);
      })
      .catch(error => {
        this.loading = false;
        this.errors = error;
      });
  }

  delete(row: any) {
    this.loading = true;
    this.errors = null;
    this.service
      .delete(row)
      .then(res => {
        this.loading = false;
        this.errors = null;
        this.afterDelete(true);
        this.item = null;
      })
      .catch(error => {
        this.loading = false;
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

  afterUpdate(result: any) {
    if (this.refreshRowOnSave) {
      this.refreshSelectedRow();
    } else {
      this.mergeSelectedRow(result);
    }
    this.events.onRowsChanged();
  }

  afterDelete(result: boolean) {
    if (result) {
      this.rows.splice(this.getSelectedRowIndex(), 1);
    }
  }

  mergeSelectedRow(result: any) {
    for (const key of Object.keys(result)) {
      if (key in this.rows[this.getSelectedRowIndex()]) {
        this.rows[this.getSelectedRowIndex()][key] = result[key];
      }
    }
  }

  refreshRow(row: any, isNew: boolean) {
    this.loading = true;
    this.errors = null;
    this.service.getItem(row)
      .then(data => {
        this.loading = false;
        if (isNew) {
          this.addRow(data);
        } else {
          this.mergeSelectedRow(data);
        }
      })
      .catch(error => {
        this.loading = false;
        this.errors = error;
      });
  }

  refreshSelectedRow() {
    this.refreshRow(this.rows[this.getSelectedRowIndex()], false);
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
