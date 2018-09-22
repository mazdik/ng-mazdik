import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataSource, RequestMetadata, PagedResult} from '../../ng-crud-table';
import {DataSort, DataFilter} from '../../ng-data-table/base';

@Injectable()
export class DemoService implements DataSource {

  url: string;
  primaryKeys: any;

  private itemsPerPage: number = 20;
  private dataFilter: DataFilter;
  private dataSort: DataSort;

  constructor(private http: HttpClient, private perPage?: number) {
    this.dataFilter = new DataFilter();
    this.dataSort = new DataSort();
    this.itemsPerPage = perPage || this.itemsPerPage;
  }

  getItems(requestMeta: RequestMetadata): Promise<PagedResult> {
    const page = requestMeta.pageMeta.currentPage;
    this.dataFilter.filters = requestMeta.filters;
    this.dataFilter.globalFilterValue = requestMeta.globalFilterValue;
    this.dataSort.sortMeta = requestMeta.sortMeta;

    return this.http.get<PagedResult>(this.url)
      .toPromise()
      .then(function (res) {
        const rows: any[] = res || [];
        const filteredData = this.dataFilter.filterRows(rows);
        const sortedData = this.dataSort.sortRows(filteredData);
        const pageData = this.page(sortedData, page);
        const totalCount = sortedData.length;
        const pageCount = pageData.length;
        const result = <PagedResult>{
          'items': pageData,
          '_meta': {
            'totalCount': totalCount,
            'pageCount': pageCount,
            'currentPage': page,
            'perPage': this.itemsPerPage
          }
        };
        return result;
      }.bind(this));
  }

  getItem(row: any): Promise<any> {
    const filters = {};
    for (const key of this.primaryKeys) {
      filters[key] = {value: row[key]};
    }
    const requestMeta = <RequestMetadata> {
      pageMeta: {currentPage: 1},
      filters: filters,
    };
    return this.getItems(requestMeta)
      .then(data => data.items[0]);
  }

  page(data: any, page: any): Array<any> {
    const start = (page - 1) * this.itemsPerPage;
    const end = this.itemsPerPage > -1 ? (start + this.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  post(item: any): Promise<any> {
    // this.data.items.push(item); // exist in component
    return new Promise((resolve) => {
      setTimeout(() => resolve(item), 250);
    });
  }

  put(item: any): Promise<any> {
    // this.data.items[this.findSelectedItemIndex(item)] = item; // exist in component
    return new Promise((resolve) => {
      setTimeout(() => resolve(item), 250);
    });
  }

  delete(item: any): Promise<any> {
    // this.data.items.splice(this.findSelectedItemIndex(item), 1); // exist in component
    return new Promise((resolve) => {
      setTimeout(() => resolve(item), 250);
    });
  }

  getOptions(url: string, parentId: any): Promise<any> {
    return this.http.get(url)
      .toPromise()
      .then((response: any) => {
        const result = response.filter((value: any) => {
          return value['parentId'] === parentId;
        });
        return new Promise((resolve) => {
          setTimeout(() => resolve(result), 1000);
        });
      })
      .catch(this.handleError);
  }

  private handleError(error: any) {
    const errMsg = error.message ? error.message : error.toString();
    return Promise.reject(errMsg);
  }

}
