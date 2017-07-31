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
    let url = this.url;
    filters = this.filterObject(filters);
    return this.http.post(url, {
      process: this.settings.process,
      limit: 25,
      page: page,
      sort_field: sortField,
      sort: sortOrder,
      filters: filters
    }, {headers: headers})
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
    let url = `${this.url}?q={"${this.primaryKey}":${item[this.primaryKey]}}`;
    return this.http
      .delete(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    let count = (body.items[0] && body.items[0].row_cnt) ? body.items[0].row_cnt : 0;
    let limit = body.limit;
    let meta = {
      "totalCount": count,
      "perPage": limit
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

  private filterObject(obj: Filter): any {
    let filterObjects = [];

    for (let key in obj) {
      if (obj[key]['value']) {
        filterObjects.push({field: key, value: obj[key]['value'], matchMode: obj[key]['matchMode'] || 'eq'});
      }
    }
    return JSON.stringify({params: filterObjects});
  }

}
