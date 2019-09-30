import {DataSource, RequestMetadata} from './types';
import {FilterMetadata} from '../../ng-data-table/base/types';
import {Row} from '../../ng-data-table/base/row';
import {DataTable} from '../../ng-data-table/base/data-table';
import {ColumnBase} from '../../ng-data-table/base/column-base';
import {ColumnModelGenerator} from '../../ng-data-table/base/column-model-generator';
import {CdtSettings} from './cdt-settings';
import {DtMessages} from '../../dt-translate/dt-messages';

export class DataManager extends DataTable {

  readonly settings: CdtSettings;
  readonly service: DataSource;
  item: any;
  refreshRowOnSave: boolean;
  pagerCache: any = {};

  constructor(columns: ColumnBase[], settings: CdtSettings, dataSource: DataSource, messages?: DtMessages) {
    super(((x) => { columns.unshift(x); return columns; })(ColumnModelGenerator.actionColumn), settings, messages);
    this.settings = new CdtSettings(settings);
    this.clientSide = false;
    this.service = dataSource;

    this.columns.forEach(col => {
      if (col.filterValues && typeof col.filterValues === 'string') {
        col.filterValues = this.service.getOptions.bind(this.service, col.filterValues);
      }
    });
  }

  get filters(): FilterMetadata { return this.dataFilter.filters; }
  set filters(val: FilterMetadata) {
    this.dataFilter.filters = val;
    this.events.onFilter();
  }

  loadItems() {
    return this.getItems(this.settings.virtualScroll);
  }

  getItems(concatRows: boolean = false): Promise<any> {
    if (concatRows === true && this.pagerCache[this.pager.current]) {
      return Promise.resolve();
    }
    this.events.onLoading(true);
    this.setSortMetaGroup();
    const requestMeta: RequestMetadata = {
      pageMeta: {currentPage: this.pager.current, perPage: this.pager.perPage},
      filters: this.dataFilter.filters,
      sortMeta: this.sorter.sortMeta,
      globalFilterValue: this.dataFilter.globalFilterValue,
    };

    return this.service
      .getItems(requestMeta)
      .then(data => {
        this.rows = (concatRows) ? this.rows.concat(data.items) : data.items;
        if (concatRows) {
          this.pager.total = (data._meta.totalCount > this.rows.length) ? this.rows.length + 1 : this.rows.length;
        } else {
          this.pager.total = data._meta.totalCount;
        }
        this.pager.perPage = data._meta.perPage;
        this.pagerCache[this.pager.current] = true;
      })
      .finally(() => { this.events.onLoading(false); });
  }

  create(row: Row) {
    this.events.onLoading(true);
    this.service
      .post(row)
      .then(res => {
        if (this.refreshRowOnSave) {
          this.loadItems();
        } else {
          this.addRow(res || row);
        }
      })
      .finally(() => { this.events.onLoading(false); });
  }

  update(row: Row) {
    this.events.onLoading(true);
    this.service.put(row)
      .then(res => {
        this.afterUpdate(row, res);
      })
      .finally(() => { this.events.onLoading(false); });
  }

  delete(row: Row) {
    this.events.onLoading(true);
    this.service
      .delete(row)
      .then(res => {
        this.deleteRow(row);
      })
      .finally(() => { this.events.onLoading(false); });
  }

  afterUpdate(row: Row, result: any) {
    if (this.refreshRowOnSave) {
      this.refreshRow(row);
    } else {
      this.mergeRow(row, result || row);
    }
  }

  refreshRow(row: Row) {
    this.events.onLoading(true);
    this.service.getItem(row)
      .then(data => {
        this.mergeRow(row, data);
      })
      .finally(() => { this.events.onLoading(false); });
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
