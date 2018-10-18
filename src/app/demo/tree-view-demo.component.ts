import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TreeNode, TreeDataSource} from '../../lib/tree-view';
import {MenuItem} from '../../lib/context-menu';
import {TreeDemoService} from './tree-demo.service';

@Component({
  selector: 'app-tree-view-demo',
  template: `
  <div style="width: 250px; height: 500px; border-right: 1px solid #eee">
    <app-tree-view
      [service]="treeDataSource"
      (selectedChanged)="onSelectNode($event)"
      [serverSideFiltering]="true"
      [contextMenu]="contextMenu"
      [getIconFunc]="getIconFunc">
    </app-tree-view>
    <app-context-menu #contextMenu [items]="items"></app-context-menu>
  </div>
  `
})
export class TreeViewDemoComponent implements OnInit {

  treeDataSource: TreeDataSource;
  selectedNode: TreeNode;
  items: MenuItem[];
  getIconFunc = (node) => (!node.isLeaf()) ? 'tree-icon tree-folder' : 'tree-icon tree-file';

  constructor(private http: HttpClient) {
    this.treeDataSource = new TreeDemoService(this.http);
  }

  ngOnInit() {
    this.items = [
      {label: 'View Task', command: (event) => console.log(this.selectedNode)},
      {label: 'Edit Task', command: (event) => console.log(event)},
      {label: 'Delete Task', command: (event) => console.log(event), disabled: true}
    ];
  }

  onSelectNode(node: TreeNode) {
    this.selectedNode = node;
    console.log(node);
  }

}
