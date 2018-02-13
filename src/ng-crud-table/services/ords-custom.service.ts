import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Filter, SortMeta, DataSource} from '../types';

@Injectable()
export class OrdsCustomService implements DataSource {

  public url: string;
  public primaryKeys: string[];
  public process: string;

  constructor(private http: HttpClient) {
  }

  getAuthHeaders() {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authToken}`);
    return headers;
  }

  getItems(page: number = 1, filters?: Filter, sortMeta?: SortMeta[]): Promise<any> {
    const headers = this.getAuthHeaders();
    const url = this.url;
    filters = this.filterObject(filters);
    return this.http.post(url, {
      process: this.process,
      limit: 25,
      page: page,
      sort_field: (sortMeta && sortMeta.length) ? sortMeta[0].field : null,
      sort: (sortMeta && sortMeta.length) ? sortMeta[0].order : null,
      filters: filters
    }, {headers: headers})
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
      .post(this.url + '/', JSON.stringify(row), {headers: headers})
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }

  put(row: any): Promise<any> {
    const headers = this.getAuthHeaders();
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
      .put(url, JSON.stringify(row), {headers: headers})
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }

  delete(row: any): Promise<any> {
    const headers = this.getAuthHeaders();
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
      .delete(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  private extractData(res: any) {
    let body = res;
    const count = (body.items[0] && body.items[0].row_cnt) ? body.items[0].row_cnt : 0;
    const limit = body.limit;
    const meta = {
      'totalCount': count,
      'perPage': limit
    };
    body = {'items': body.items, '_meta': meta};
    return body;
  }

  private handleError(error: any) {
    const errMsg = error.message ? error.message : error.toString();
    console.error(error);
    return Promise.reject(errMsg);
  }

  private filterObject(obj: Filter): any {
    const filterObjects = [];

    for (const key in obj) {
      if (obj[key] && obj[key].value) {
        filterObjects.push({
          'field': key,
          'value': Array.isArray(obj[key].value) ? obj[key].value[0] : obj[key].value,
          'matchMode': obj[key].matchMode || 'eq'
        });
      }
    }
    return JSON.stringify({params: filterObjects});
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

}
