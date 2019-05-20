import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {RequestMetadata, DataSource, PagedResult} from '../../lib/ng-crud-table';
import {NotifyService} from '../../lib/notify/notify.service';

@Injectable()
export class RestlessService implements DataSource {

  url: string;
  primaryKeys: string[];

  constructor(private http: HttpClient, private notifyService: NotifyService) {
  }

  get headers() {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return headers;
  }

  getItems(requestMeta: RequestMetadata): Promise<PagedResult> {
    const page = requestMeta.pageMeta.currentPage;
    let url = this.url;
    if (page > 1) {
      if (url.indexOf('?') === -1) {
        url = url + '?page=' + page;
      } else {
        url = url + '&page=' + page;
      }
    }
    if (this.filterObject(requestMeta)) {
      url += (url.indexOf('?') === -1) ? '?' : '&';
      url = url + this.filterObject(requestMeta);
    }
    return this.http.get<PagedResult>(url, {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError.bind(this));
  }

  getItem(row: any): Promise<any> {
    const filters = {};
    for (const key of this.primaryKeys) {
      filters[key] = {value: row[key]};
    }
    const requestMeta = {
      pageMeta: {currentPage: 1},
      filters,
    } as RequestMetadata;
    return this.getItems(requestMeta)
      .then(data => data.items[0]);
  }

  post(row: any): Promise<any> {
    return this.http
      .post(this.removeUrlParams(this.url), JSON.stringify(row), {headers: this.headers})
      .toPromise()
      .then(res => res)
      .catch(this.handleError.bind(this));
  }

  put(row: any): Promise<any> {
    let url = this.removeUrlParams(this.url);
    if (Array.isArray(this.primaryKeys) && this.primaryKeys.length > 1) {
      url = url + '?';
      for (const key of this.primaryKeys) {
        url += key + '=' + row[key] + '&';
      }
      url = url.slice(0, -1);
    } else {
      url = (this.primaryKeys) ? `${url}/${row[this.primaryKeys[0]]}` : url;
    }
    return this.http
      .put(url, JSON.stringify(row), {headers: this.headers})
      .toPromise()
      .then(res => res)
      .catch(this.handleError.bind(this));
  }

  delete(row: any): Promise<any> {
    let url = this.removeUrlParams(this.url);
    if (Array.isArray(this.primaryKeys) && this.primaryKeys.length > 1) {
      url = url + '?';
      for (const key of this.primaryKeys) {
        url += key + '=' + row[key] + '&';
      }
      url = url.slice(0, -1);
    } else {
      url = (this.primaryKeys) ? `${url}/${row[this.primaryKeys[0]]}` : url;
    }
    return this.http
      .delete(url, {headers: this.headers})
      .toPromise()
      .catch(this.handleError.bind(this));
  }

  private extractData(res: any) {
    let body = res;
    const meta = {
      totalCount: body.num_results,
      perPage: body.limit || 10
    };
    const items = (body.objects) ? body.objects : body;
    body = {items, _meta: meta};
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
    const filters = [];
    let orderby = {};
    let result = '';

    if (sortMeta && sortMeta.length) {
      const sortField: string = sortMeta[0].field;
      const sortOrder: number = sortMeta[0].order;
      const direction = sortOrder > 0 ? 'asc' : (sortOrder < 0 ? 'desc' : null);
      if (direction) {
        orderby = [{field: sortField, direction}];
      }
    }

    for (const key in obj) {
      if (obj[key] && obj[key].value) {
        filters.push({
          name: key,
          op: 'eq',
          val: Array.isArray(obj[key].value) ? obj[key].value[0] : obj[key].value
        });
      }
    }
    const filterObject = {
      filters,
      order_by: orderby
    };
    if (Object.keys(filterObject).length !== 0) {
      result = 'q=' + JSON.stringify(filterObject);
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

  removeUrlParams(url: string) {
    if (url.indexOf('?') !== -1) {
      url = url.substring(0, url.indexOf('?'));
    }
    return url;
  }

}
