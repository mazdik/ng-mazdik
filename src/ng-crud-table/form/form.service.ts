import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FormService {

  constructor(private http: HttpClient) {
  }

  getOptions(url: string, parentId: any): Promise<any> {
    return this.http.get(url + '/' + parentId)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(this.handleError);
  }

  private handleError(error: any) {
    const errMsg = error.message ? error.message : error.toString();
    console.error(error);
    return Promise.reject(errMsg);
  }

}
