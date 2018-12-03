import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RequestMetadata, DataSource, PagedResult} from '../base';
import {NotifyService} from '../../lib/notify/notify.service';

@Injectable()
export class OrdsService implements DataSource {

  url: string;
  primaryKeys: string[];

  constructor(private http: HttpClient, private notifyService: NotifyService) {
  }

  getItems(requestMeta: RequestMetadata): Promise<PagedResult> {
    const page = requestMeta.pageMeta.currentPage;

    let url = this.url + '/';
    if (page > 1) {
      url = url + '/?offset=' + page;
    }
    url = url + this.filterObject(requestMeta);
    return this.http.get<PagedResult>(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError.bind(this));
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

  post(row: any): Promise<any> {
    return this.http
      .post(this.url + '/', JSON.stringify(row))
      .toPromise()
      .then(res => res)
      .catch(this.handleError.bind(this));
  }

  put(row: any): Promise<any> {
    let url;
    if (Array.isArray(this.primaryKeys) && this.primaryKeys.length > 1) {
      url = this.url + '?';
      for (const key of this.primaryKeys) {
        url += key + '=' + row[key] + '&';
      }
      url = url.slice(0, -1);
    } else {
      url = (this.primaryKeys) ? `${this.url}/${row[this.primaryKeys[0]]}` : this.url;
    }
    return this.http
      .put(url, JSON.stringify(row))
      .toPromise()
      .then(res => res)
      .catch(this.handleError.bind(this));
  }

  delete(row: any): Promise<any> {
    let url;
    if (Array.isArray(this.primaryKeys) && this.primaryKeys.length > 1) {
      url = this.url + '?';
      for (const key of this.primaryKeys) {
        url += key + '=' + row[key] + '&';
      }
      url = url.slice(0, -1);
    } else {
      url = (this.primaryKeys) ? `${this.url}/?q={"${this.primaryKeys}":${row[this.primaryKeys[0]]}}` : this.url;
    }
    return this.http
      .delete(url)
      .toPromise()
      .catch(this.handleError.bind(this));
  }

  private extractData(res: any) {
    let body = res;
    const meta = {
      'totalCount': body.count,
      'perPage': body.limit
    };
    body = {'items': body.items, '_meta': meta};
    return body;
  }

  private handleError(error: any) {
    const errMsg = error.message ? error.message : error.toString();
    this.notifyService.sendMessage({title: 'HttpErrorResponse', text: errMsg, severity: 'error'});
    console.error(error);
    return Promise.reject(errMsg);
  }

  private filterObject(requestMeta: RequestMetadata): string {
    const obj = requestMeta.filters;
    const sortMeta = requestMeta.sortMeta;
    const filterObject = {};
    let orderby = {};
    let result = '';

    if (sortMeta && sortMeta.length) {
      const sortField: string = sortMeta[0].field;
      const sortOrder: number = sortMeta[0].order;
      orderby = {[sortField]: sortOrder};
    }

    for (const key in obj) {
      if (obj[key] && obj[key].value) {
        filterObject[key] = {'$eq': Array.isArray(obj[key].value) ? obj[key].value[0] : obj[key].value};
      }
    }

    if (Object.keys(orderby).length !== 0) {
      filterObject['$orderby'] = orderby;
    }
    if (Object.keys(filterObject).length !== 0) {
      result = '?q=' + JSON.stringify(filterObject);
    }
    return result;
  }

  getOptions(url: string, parentId: any): Promise<any> {
    url = (parentId !== undefined) ? url + '/' + parentId : url;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(this.handleError.bind(this));
  }

}
