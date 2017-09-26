import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Filter, ICrudService, Settings} from '../types/interfaces';

@Injectable()
export class RestlessService implements ICrudService {

  public url: string;
  public primaryKey: any;
  public settings: Settings;

  constructor(private http: Http) {
  }

  getJsonHeaders() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  getAuthHeaders() {
    const headers = this.getJsonHeaders();
    const authToken = localStorage.getItem('auth_token');
    headers.append('Authorization', `Bearer ${authToken}`);
    return headers;
  }

  getItems(page: number = 1, filters?: Filter, sortField?: string, sortOrder?: number): Promise<any> {
    const headers = this.getAuthHeaders();
    let url = this.url;
    if (page > 1) {
      url = url + '?page=' + page;
    }
    url = url + this.filterObject(filters, sortField, sortOrder);
    // const url = this.url + '?page=' + page + this.urlEncode(filters) + this.urlSort(sortField, sortOrder);
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

  save(item: any): Promise<any> {
    if (item[this.primaryKey]) {
      return this.put(item);
    }
    return this.post(item);
  }

  // Add new
  post(item: any): Promise<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .post(this.url, JSON.stringify(item), {headers: headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  // Update existing
  put(item: any) {
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
      .then(res => res.json())
      .catch(this.handleError);
  }

  delete(item: any) {
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
      .delete(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    const meta = {
      'totalCount': body.num_results,
      'perPage': 10
    };
    const items = (body.objects) ? body.objects : body;
    body = {'items': items, '_meta': meta};
    return body;
  }

  private handleError(response: Response | any) {
    let errMsg: string;
    let errors: any;
    let fieldErrors: any;
    if (response instanceof Response) {
      const body = response.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${response.status} - ${response.statusText || ''} ${err}`;
    } else {
      errMsg = response.message ? response.message : response.toString();
    }

    if (response.status === 422) {
      fieldErrors = response.json();
    }
    errors = {'errMsg': errMsg, 'fieldErrors': fieldErrors};
    console.error(response);
    return Promise.reject(errors);
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
      result = '?q=' + JSON.stringify(filterObject);
    }
    return result;
  }

}
