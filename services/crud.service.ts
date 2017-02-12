import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CrudService {

  public url;

  constructor(private http:Http) {
  }

  getJsonHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  getAuthHeaders() {
    let headers = this.getJsonHeaders();
    let authToken = localStorage.getItem('auth_token');
    headers.append('Authorization', `Bearer ${authToken}`);
    return headers;
  }

  getItems(page:number = 1, filters?:{[s:string]:any;}, sortField?:string, sortOrder?:number):Promise<any> {
    let headers = this.getAuthHeaders();
    let url = this.url + "?page=" + page + this.urlEncode(filters) + this.urlSort(sortField, sortOrder)
    return this.http.get(url, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getItem(id:number) {
    let filterId = {
      id: {value: id}
    };
    return this.getItems(1, filterId)
      .then(data => data.items[0]);
  }

  save(item:any):Promise<any> {
    if (item.id) {
      return this.put(item);
    }
    return this.post(item);
  }

  delete(item:any) {
    let headers = this.getAuthHeaders();
    ;
    let url = `${this.url}/${item.id}`;
    return this.http
      .delete(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  // Add new
  post(item:any):Promise<any> {
    let headers = this.getAuthHeaders();
    ;
    return this.http
      .post(this.url, JSON.stringify(item), {headers: headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  // Update existing
  put(item:any) {
    let headers = this.getAuthHeaders();
    ;
    let url = `${this.url}/${item.id}`;
    return this.http
      .put(url, JSON.stringify(item), {headers: headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private extractData(res:Response) {
    let body = res.json();
    return body;
  }

  private handleError(response: Response | any) {
    let errMsg: string;
    let errors : any;
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

  private urlEncode(obj:{[s:string]:any;}):string {
    let urlSearchParams = new URLSearchParams();
    for (let key in obj) {
      if (obj[key]['value']) {
        urlSearchParams.append(key, obj[key]['value']);
      }
    }
    let url = urlSearchParams.toString();
    return (url) ? '&' + url : '';
  }

  private urlSort(sortField:string, sortOrder:number):string {
    if (sortField) {
      if (sortOrder > 0) {
        return '&sort=' + sortField;
      } else if(sortOrder < 0) {
        return '&sort=-' + sortField;
      } else {
        return '';  
      }
    } else {
      return '';
    }
  }

}
