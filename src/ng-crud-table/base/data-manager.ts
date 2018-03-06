import {DataSource} from '../types';
import {DataTable} from './data-table';
import {ColumnBase} from './column-base';
import {Settings} from './settings';

export class DataManager extends DataTable {

  public service: DataSource;
  public errors: any;
  public loading: boolean;
  public item: any;
  public isNewItem: boolean;
  public detailView: boolean;
  public formValid: boolean = true;
  public refreshRowOnSave: boolean;

  constructor(columns?: ColumnBase[], settings?: Settings) {
    super(columns, settings);
  }

  createColumns(columns: ColumnBase[]) {
    super.createColumns(columns);
    this.refreshRowOnSave = this.columns.some(x => x.keyColumn !== undefined);
  }

  setService(service: DataSource) {
    this.service = service;
    if (this.settings.api) {
      this.service.url = this.settings.api;
    }
    this.service.primaryKeys = this.settings.primaryKeys;
  }

  getItems(): Promise<any> {
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
        this.rows = data.items;
        this.pager.total = data._meta.totalCount;
        this.pager.perPage = data._meta.perPage;
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
      this.rows.push(result);
    }
  }

  afterUpdate(result: any) {
    if (this.refreshRowOnSave) {
      this.refreshSelectedRow();
    } else {
      for (const key of Object.keys(result)) {
        if (key in this.rows[this.getSelectedRowIndex()]) {
          this.rows[this.getSelectedRowIndex()][key] = result[key];
        }
      }
    }
  }

  afterDelete(result: boolean) {
    if (result) {
      this.rows.splice(this.getSelectedRowIndex(), 1);
    }
  }

  refreshRow(row: any, isNew: boolean) {
    this.loading = true;
    this.errors = null;
    this.service.getItem(row)
      .then(data => {
        this.loading = false;
        if (isNew) {
          this.rows.push(data);
        } else {
          this.rows[this.getSelectedRowIndex()] = data;
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

  setItem(rowIndex: number) {
    const item = this.rows[rowIndex];
    this.item = Object.assign({}, item);
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
