import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TreeNode, TreeDataSource} from 'ng-mazdik-lib';

@Injectable({
  providedIn: 'root'
})
export class TreeDemoService implements TreeDataSource {

  url: string = 'assets/tree.json';

  constructor(private http: HttpClient) {}

  getNodes(node: TreeNode): Promise<TreeNode[]> {
    const children: any[] = [
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
      children[0].id = 'MALE' + node.$$level;
      children[0].name = 'MALE' + node.$$level;
      children[0].leaf = (node.$$level === 10);
      children[1].id = 'FEMALE' + node.$$level;
      children[1].name = 'FEMALE' + node.$$level;
      return new Promise((resolve) => {
        setTimeout(() => resolve(children), 500);
      });
    } else {
      return this.http.get<TreeNode[]>(this.url)
        .toPromise();
    }
  }

  searchNodes(name: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(['ELYOS', 'MALE', 'LAZY']), 500);
    });
  }

}
