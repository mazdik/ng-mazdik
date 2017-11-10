import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import {Filter, ICrudService} from '../types/interfaces';

@Injectable()
export class OrdsService implements ICrudService {

  public url: string;
  public primaryKey: any;

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
    let url = this.url + '/';
    if (page > 1) {
      url = url + '/?offset=' + page;
    }
    url = url + this.filterObject(filters, sortField, sortOrder);
    return this.http.get(url, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getItem(id: number): Promise<any> {
    const filterId = {
      [this.primaryKey]: {value: id}
    };
    return this.getItems(1, filterId)
      .then(data => data.items[0]);
  }

  // Add new
  post(item: any): Promise<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .post(this.url + '/', JSON.stringify(item), {headers: headers})
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }

  // Update existing
  put(item: any): Promise<any> {
    const headers = this.getAuthHeaders();
    let url;
    if (Array.isArray(this.primaryKey)) {
      url = this.url + '?';
      for (const key of this.primaryKey) {
        url += key + '=' + item[key] + '&';
      }
      url = url.slice(0, -1);
    } else {
      url = (this.primaryKey) ? `${this.url}/${item[this.primaryKey]}` : this.url;
    }
    return this.http
      .put(url, JSON.stringify(item), {headers: headers})
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }

  delete(item: any): Promise<any> {
    const headers = this.getAuthHeaders();
    let url;
    if (Array.isArray(this.primaryKey)) {
      url = this.url + '?';
      for (const key of this.primaryKey) {
        url += key + '=' + item[key] + '&';
      }
      url = url.slice(0, -1);
    } else {
      url = (this.primaryKey) ? `${this.url}/?q={"${this.primaryKey}":${item[this.primaryKey]}}` : this.url;
    }
    return this.http
      .delete(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
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
    console.error(error);
    return Promise.reject(errMsg);
  }

  private filterObject(obj: Filter, sortField?: string, sortOrder?: number): string {
    const filterObject = {};
    let orderby = {};
    let result = '';

    if (sortField && sortOrder) {
      orderby = {[sortField]: sortOrder};
    }

    for (const key in obj) {
      if (obj[key]['value'] && obj[key]['value'].trim()) {
        if (typeof obj[key]['value'] === 'string') { // TODO
          filterObject[key] = {'$like': obj[key]['value'] + '%25'};
        } else {
          filterObject[key] = {'$eq': obj[key]['value']};
        }
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
    return this.http.get(url + '/' + parentId)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(this.handleError);
  }

}
