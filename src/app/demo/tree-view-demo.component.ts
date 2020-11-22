import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode, MenuItem, MenuEventArgs, ContextMenuComponent } from 'ng-mazdik-lib';
import { TreeDemoService } from './tree-demo.service';

@Component({
  selector: 'app-tree-view-demo',
  template: `
    <app-tree-view class="tree-view-demo"
      [service]="treeService"
      (selectedChanged)="onSelectNode($event)"
      (nodeRightClick)="onNodeRightClick($event)"
      [serverSideFiltering]="true"
      [getIconFunc]="getIconFunc">
    </app-tree-view>
    <app-context-menu #contextMenu [menu]="items"></app-context-menu>
  `
})
export class TreeViewDemoComponent implements OnInit {

  selectedNode: TreeNode;
  items: MenuItem[];

  @ViewChild('contextMenu') contextMenu: ContextMenuComponent;

  getIconFunc = (node) => (!node.isLeaf()) ? 'dt-icon-folder' : 'dt-icon-file';

  constructor(public treeService: TreeDemoService) { }

  ngOnInit(): void {
    this.items = [
      { label: 'View Task', command: (event) => console.log(this.selectedNode) },
      { label: 'Edit Task', command: (event) => console.log(event) },
      { label: 'Delete Task', command: (event) => console.log(event), disabled: true }
    ];
  }

  onSelectNode(node: TreeNode): void {
    this.selectedNode = node;
    console.log(node);
  }

  onNodeRightClick(event): void {
    this.contextMenu.show({ originalEvent: event.originalEvent, data: event.data } as MenuEventArgs);
  }

}
