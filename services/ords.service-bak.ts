import {Injectable} from '@angular/core';
import {Http, Response, URLSearchParams, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Filter, ICrudService, Settings} from '../types/interfaces';

@Injectable()
export class OrdsService implements ICrudService {

  public url: string;
  public primaryKey: string = 'id';
  public settings: Settings;

  constructor(private http: Http) {
  }

  getJsonHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  getAuthHeaders() {
    let headers = this.getJsonHeaders();
    let authToken = localStorage.getItem('auth_token');
    if (authToken) {
      headers.append('Authorization', `Bearer ${authToken}`);
    }
    return headers;
  }

  getItems(page: number = 1, filters?: Filter, sortField?: string, sortOrder?: number): Promise<any> {
    let headers = this.getAuthHeaders();
    let url = this.url + "/";
    if (page > 1) {
      url = url + "/?offset=" + page;
    }
    url = url + this.filterObject(filters, sortField, sortOrder);
    return this.http.get(url, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getItem(id: number): Promise<any> {
    let filterId = {
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
    let headers = this.getAuthHeaders();
    return this.http
      .post(this.url + '/', JSON.stringify(item), {headers: headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  // Update existing
  put(item: any) {
    let headers = this.getAuthHeaders();
    let url = `${this.url}/${item[this.primaryKey]}`;
    return this.http
      .put(url, JSON.stringify(item), {headers: headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  delete(item: any) {
    let headers = this.getAuthHeaders();
    let url = `${this.url}/?q={"${this.primaryKey}":${item[this.primaryKey]}}`;
    return this.http
      .delete(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    let meta = {
      "totalCount": body.count,
      "perPage": body.limit
    };
    body = {"items": body.items, "_meta": meta};
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
    let filterObject = {};
    let orderby = {};
    let result = '';

    if (sortField && sortOrder) {
      orderby = {[sortField]: sortOrder};
    }

    for (let key in obj) {
      if (obj[key]['value'] && obj[key]['value'].trim()) {
        if (typeof obj[key]['value'] === 'string') { // TODO
          filterObject[key] = {"$like": obj[key]['value'] + '%25'};
        } else {
          filterObject[key] = {"$eq": obj[key]['value']};
        }
      }
    }

    if (Object.keys(orderby).length !== 0) {
      filterObject["$orderby"] = orderby;
    }
    if (Object.keys(filterObject).length !== 0) {
      result = '?q=' + JSON.stringify(filterObject)
    }
    return result;
  }

}
