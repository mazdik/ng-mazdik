import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import {Filter, ICrudService} from '../types/interfaces';

@Injectable()
export class RestlessService implements ICrudService {

  public url: string;
  public primaryKeys: string[];

  constructor(private http: HttpClient) {
  }

  getAuthHeaders() {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authToken}`);
    return headers;
  }

  getItems(page: number = 1, filters?: Filter, sortField?: string, sortOrder?: number): Promise<any> {
    const headers = this.getAuthHeaders();
    let url = this.url;
    if (page > 1) {
      if (url.indexOf('?') === -1) {
        url = url + '?page=' + page;
      } else {
        url = url + '&page=' + page;
      }
    }
    if (this.filterObject(filters, sortField, sortOrder)) {
      url += (url.indexOf('?') === -1) ? '?' : '&';
      url = url + this.filterObject(filters, sortField, sortOrder);
    }
    return this.http.get(url, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getItem(row: any): Promise<any> {
    const filters: Filter = {};
    for (const key of this.primaryKeys) {
      filters[key] = {value: row[key]};
    }
    return this.getItems(1, filters)
      .then(data => data.items[0]);
  }

  post(row: any): Promise<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .post(this.removeUrlParams(this.url), JSON.stringify(row), {headers: headers})
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }

  put(row: any): Promise<any> {
    const headers = this.getAuthHeaders();
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
      .put(url, JSON.stringify(row), {headers: headers})
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }

  delete(row: any): Promise<any> {
    const headers = this.getAuthHeaders();
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
      .delete(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  private extractData(res: any) {
    let body = res;
    const meta = {
      'totalCount': body.num_results,
      'perPage': body.limit || 10
    };
    const items = (body.objects) ? body.objects : body;
    body = {'items': items, '_meta': meta};
    return body;
  }

  private handleError(error: any) {
    const errMsg = error.message ? error.message : error.toString();
    console.error(error);
    return Promise.reject(errMsg);
  }

  private filterObject(obj: Filter, sortField?: string, sortOrder?: number): string {
    const filters = [];
    let orderby = {};
    let result = '';
    const filterObject = {};

    if (sortField && sortOrder) {
      const direction = sortOrder > 0 ? 'asc' : (sortOrder < 0 ? 'desc' : null);
      if (direction) {
        orderby = [{'field': sortField, 'direction': direction}];
      }
    }

    for (const key in obj) {
      if (obj[key]['value'] && obj[key]['value']) {
        filters.push({'name': key, 'op': 'eq', 'val': obj[key]['value']});
      }
    }

    if (Object.keys(filters).length !== 0) {
      filterObject['filters'] = filters;
    }
    if (Object.keys(orderby).length !== 0) {
      filterObject['order_by'] = orderby;
    }

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
      .catch(this.handleError);
  }

  removeUrlParams(url: string) {
    if (url.indexOf('?') !== -1) {
      url = url.substring(0, url.indexOf('?'));
    }
    return url;
  }

}
