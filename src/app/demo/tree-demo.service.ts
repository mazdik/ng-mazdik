import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import {ITreeNode, ITreeService} from '../../ng-crud-table';


@Injectable()
export class TreeDemoService implements ITreeService {

  public url: string = 'assets/tree.json';

  constructor(private http: HttpClient) {
  }

  getNodes(node: ITreeNode): Promise<ITreeNode[]> {
    const children: ITreeNode[] = [
      {
        id: 'MALE',
        name: 'MALE',
        data: {column: 'gender'},
        leaf: false,
      },
      {
        id: 'FEMALE',
        name: 'FEMALE',
        data: {column: 'gender'},
      }];
    if (node) {
      if (node.$$level) {
        children[0].id = 'MALE' + node.$$level;
        children[0].name = 'MALE' + node.$$level;
        children[0].leaf = (node.$$level === 10);
        children[1].id = 'FEMALE' + node.$$level;
        children[1].name = 'FEMALE' + node.$$level;
      }
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

  searchNodes(name: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(['ELYOS', 'MALE', 'LAZY']), 500);
    });
  }

}
