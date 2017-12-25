import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import {Filter, ICrudService} from '../../ng-crud-table';


@Injectable()
export class DemoService implements ICrudService {

  public url: string;
  public primaryKeys: any;

  private itemsPerPage: number = 20;

  constructor(private http: HttpClient) {
  }

  getItems(page: number = 1, filters ?: Filter, sortField ?: string, sortOrder ?: number): Promise<any> {
    return this.http.get(this.url)
      .toPromise()
      .then(function (res) {
        const rows: any[] = res || [];
        const filteredData = this.filter(rows, filters);
        const sortedData = this.sort(filteredData, sortField, sortOrder);
        const pageData = this.page(sortedData, page);
        const totalCount = sortedData.length;
        const pageCount = pageData.length;
        const result = {
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

  getItem(id: number): Promise<any> {
    const filterId = {
      [this.primaryKeys]: {value: id}
    };
    return this.getItems(1, filterId)
      .then(data => data.items[0]);
  }

  filter(data: any, filters: Filter) {
    let filteredData: Array<any> = data;
    for (const key in filters) {
      if (filters[key]['value']) {
        filteredData = filteredData.filter((item: any) => {
          if (item[key]) {
            return item[key].toString().match(filters[key]['value']);
          } else {
            return false;
          }
        });
      }
    }
    return filteredData;
  }

  sort(data: any, sortField ?: string, sortOrder ?: number) {
    return data.sort((previous: any, current: any) => {
      if (previous[sortField] > current[sortField]) {
        return sortOrder === -1 ? -1 : 1;
      } else if (previous[sortField] < current[sortField]) {
        return sortOrder === 1 ? -1 : 1;
      }
      return 0;
    });
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
        const result =  response.filter((value: any) => {
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
