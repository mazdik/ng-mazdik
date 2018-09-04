import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {RequestMetadata, DataSource, PagedResult} from '../base';

@Injectable()
export class YiiService implements DataSource {

  url: string;
  primaryKeys: string[];

  constructor(private http: HttpClient) {
  }

  getAuthHeaders() {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authToken}`);
    return headers;
  }

  getItems(requestMeta: RequestMetadata): Promise<PagedResult> {
    const page = requestMeta.pageMeta.currentPage;
    const headers = this.getAuthHeaders();
    const url = this.url + '?page=' + page + this.urlEncode(requestMeta) + this.urlSort(requestMeta);
    return this.http.get<PagedResult>(url, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
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
    const headers = this.getAuthHeaders();
    return this.http
      .post(this.url, JSON.stringify(row), {headers: headers})
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
      url = (this.primaryKeys) ? `${this.url}/${row[this.primaryKeys[0]]}` : this.url;
    }
    return this.http
      .delete(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  private extractData(res: any) {
    return res;
  }

  private handleError(error: any) {
    const errMsg = error.message ? error.message : error.toString();
    console.error(error);
    return Promise.reject(errMsg);
  }

  private urlEncode(requestMeta: RequestMetadata): string {
    const obj = requestMeta.filters;
    const urlSearchParams = Object.getOwnPropertyNames(obj)
      .reduce((p, key) => p.set(key, Array.isArray(obj[key].value) ? obj[key].value[0] : obj[key].value), new HttpParams());
    const url = urlSearchParams.toString();
    return (url) ? '&' + url : '';
  }

  private urlSort(requestMeta: RequestMetadata): string {
    const sortMeta = requestMeta.sortMeta;
    let result: string = '';
    if (sortMeta && sortMeta.length) {
      result += '&sort=';
      for (const meta of sortMeta) {
        if (meta.order > 0) {
          result += '' + meta.field + ',';
        } else if (meta.order < 0) {
          result += '-' + meta.field + ',';
        }
      }
      result = result.replace(/,+$/, '');
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

}
