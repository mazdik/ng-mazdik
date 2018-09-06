import {DataSource, RequestMetadata} from './interface';
import {Row, Filter} from '../../ng-data-table';
import {DataTable} from '../../ng-data-table/base/data-table';
import {ColumnBase} from '../../ng-data-table/base/column-base';
import {Settings} from '../../ng-data-table/base/settings';
import {Message} from '../../ng-data-table/base/message';

export class DataManager extends DataTable {

  service: DataSource;
  errors: any;
  item: any;
  refreshRowOnSave: boolean;

  constructor(columns: ColumnBase[], settings: Settings, dataSource: DataSource, messages?: Message) {
    super(columns, settings, messages);
    this.settings.clientSide = false;
    this.setService(dataSource);
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
    this.service.primaryKeys = this.columns.filter(col => col.isPrimaryKey).map(col => col.name);
  }

  getItems(concatRows: boolean = false): Promise<any> {
    this.events.onLoading(true);
    this.errors = null;
    this.rowGroup.setSortMetaGroup();
    const requestMeta = <RequestMetadata> {
      pageMeta: {currentPage: this.pager.current, perPage: this.pager.perPage},
      filters: this.dataFilter.filters,
      sortMeta: this.sorter.sortMeta,
      globalFilterValue: this.dataFilter.globalFilterValue,
    };
    return this.service
      .getItems(requestMeta)
      .then(data => {
        this.events.onLoading(false);
        this.pager.total = data._meta.totalCount;
        this.pager.perPage = data._meta.perPage;
        this.rows = (concatRows) ? this.rows.concat(data.items) : data.items;
        this.pager.setCache();
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
      })
      .catch(error => {
        this.events.onLoading(false);
        this.errors = error;
      });
  }

  afterCreate(result: any) {
    this.addRow(result);
  }

  afterUpdate(row: Row, result: any) {
    if (this.refreshRowOnSave) {
      this.refreshRow(row);
    } else {
      this.mergeRow(row, result);
    }
  }

  afterDelete(row: Row, result: boolean) {
    if (result) {
      this.deleteRow(row);
    }
  }

  refreshRow(row: Row) {
    this.events.onLoading(true);
    this.errors = null;
    this.service.getItem(row)
      .then(data => {
        this.events.onLoading(false);
        this.mergeRow(row, data);
      })
      .catch(error => {
        this.events.onLoading(false);
        this.errors = error;
      });
  }

  clear() {
    this.rows = [];
    this.pager.total = 0;
  }

  rowIsValid(row: Row) {
    const hasError = this.columns.some(x => {
      const errors = x.validate(row[x.name]);
      return (errors && errors.length > 0);
    });
    return !hasError;
  }

}
