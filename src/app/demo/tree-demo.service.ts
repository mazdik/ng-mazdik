import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import {ITreeNode, ITreeService} from '../../ng-crud-table';


@Injectable()
export class TreeDemoService implements ITreeService {

  public url: string = 'assets/tree.json';

  constructor(private http: HttpClient) {
  }

  getNodes(node: ITreeNode): Promise<any> {
    const children: ITreeNode[] = [
      {
        id: 'MALE22',
        name: 'MALE22',
        data: {column: 'gender'},
        leaf: false,
      },
      {
        id: 'FEMALE22',
        name: 'FEMALE22',
        data: {column: 'gender'},
      }];
    if (node) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(children), 500);
      });
    } else {
      return this.http.get(this.url)
        .toPromise()
        .then(function (data) {
          return <ITreeNode[]>data;
        });
    }
  }

}
