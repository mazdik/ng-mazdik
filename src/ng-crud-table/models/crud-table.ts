import {ICrudService} from '../types';
import {DataTable} from '../models/data-table';

export class CrudTable {

  public table: DataTable;
  public service: ICrudService;
  public errors: any;
  public loading: boolean;
  public items: any[];
  public item: any;
  public isNewItem: boolean;

  constructor(table: DataTable, service: ICrudService) {
    this.table = table;
    this.service = service;
    this.initService();
  }

  initService() {
    this.service.url = this.table.settings.api;
    this.service.primaryKeys = this.table.settings.primaryKeys;
  }

  getItems(): Promise<any> {
    this.loading = true;
    this.errors = null;
    return this.service
      .getItems(this.table.pager.current, this.table.dataFilter.filters, this.table.sorter.sortMeta)
      .then(data => {
        this.loading = false;
        this.items = data.items;
        this.table.pager.total = data._meta.totalCount;
        this.table.pager.perPage = data._meta.perPage;
      })
      .catch(error => {
        this.loading = false;
        this.errors = error;
      });
  }

}
