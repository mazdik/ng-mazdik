import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import {Filter, ICrudService} from '../types/interfaces';

@Injectable()
export class YiiService implements ICrudService {

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
    const url = this.url + '?page=' + page + this.urlEncode(filters) + this.urlSort(sortField, sortOrder);
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
      .post(this.url, JSON.stringify(item), {headers: headers})
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
      url = (this.primaryKey) ? `${this.url}/${item[this.primaryKey]}` : this.url;
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

  private urlEncode(obj: Filter): string {
    const urlSearchParams = Object.getOwnPropertyNames(obj)
      .reduce((p, key) => p.set(key, obj[key]['value']), new HttpParams());
    const url = urlSearchParams.toString();
    return (url) ? '&' + url : '';
  }

  private urlSort(sortField: string, sortOrder: number): string {
    if (sortField) {
      if (sortOrder > 0) {
        return '&sort=' + sortField;
      } else if (sortOrder < 0) {
        return '&sort=-' + sortField;
      } else {
        return '';
      }
    } else {
      return '';
    }
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
