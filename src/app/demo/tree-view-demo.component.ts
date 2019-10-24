import {Component, OnInit} from '@angular/core';
import {TreeNode, MenuItem} from 'ng-mazdik-lib';
import {TreeDemoService} from './tree-demo.service';

@Component({
  selector: 'app-tree-view-demo',
  template: `
  <div style="width: 280px; height: 500px; border-right: 1px solid #eee">
    <app-tree-view
      [service]="treeService"
      (selectedChanged)="onSelectNode($event)"
      [serverSideFiltering]="true"
      [contextMenu]="contextMenu"
      [getIconFunc]="getIconFunc">
    </app-tree-view>
    <app-context-menu #contextMenu [menu]="items"></app-context-menu>
  </div>
  `
})
export class TreeViewDemoComponent implements OnInit {

  selectedNode: TreeNode;
  items: MenuItem[];
  getIconFunc = (node) => (!node.isLeaf()) ? 'dt-icon-folder' : 'dt-icon-file';

  constructor(public treeService: TreeDemoService) {}

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
