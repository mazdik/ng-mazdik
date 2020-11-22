import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TreeNode, TreeHelper, FilterState } from '../tree-lib';

@Component({
  selector: 'app-tree-view-node',
  template: `
    <li *ngIf="node" [ngClass]="nodeClass()">
      <i [ngClass]="getExpanderIcon(node)"
         (click)="onExpand(node)">
      </i>
      <span [ngClass]="nodeContentClass()"
            (click)="onSelectNode(node)"
            (dblclick)="onExpand(node)"
            (contextmenu)="onNodeRightClick($event)">
        <i *ngIf="node.icon || getIconFunc" [ngClass]="getIcon(node)"></i>
        {{node.name}}
      </span>
      <ul class="tree-container" *ngIf="node.hasChildren && node.expanded">
        <app-tree-view-node
          *ngFor="let childNode of node.children"
          [node]="childNode"
          [getIconFunc]="getIconFunc"
          (selectedChanged)="selectedChanged.emit($event)"
          (nodeRightClick)="nodeRightClick.emit($event)">
        </app-tree-view-node>
      </ul>
    </li>
  `
})
export class TreeViewNodeComponent implements OnInit {

  @Input() node: TreeNode;
  @Input() getIconFunc: (node?: TreeNode) => string;

  @Output() selectedChanged: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  @Output() nodeRightClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void  {
  }

  onSelectNode(node: TreeNode): void  {
    if (this.node.tree.selectedNode !== node) {
      this.node.tree.selectedNode = node;
      this.selectedChanged.emit(node);
    }
  }

  onExpand(node: TreeNode): void  {
    node.expanded = !node.expanded;
    if (node.expanded) {
      node.$$loading = true;
      this.node.tree.loadNode(node).finally(() => { node.$$loading = false; });
    }
  }

  getExpanderIcon(node: TreeNode): string {
    return TreeHelper.getExpanderIcon(node);
  }

  getIcon(node: TreeNode): string {
    if (this.getIconFunc) {
      return this.getIconFunc(node);
    } else {
      return node.icon;
    }
  }

  nodeClass(): string {
    let cls = 'treenode';
    if (this.node.$$filterState === FilterState.NOT_FOUND) {
      cls += ' filter-not-found';
    }
    return cls;
  }

  nodeContentClass(): string {
    let cls = 'treenode-content';
    if (this.node.$$filterState === FilterState.FOUND) {
      cls += ' filter-found';
    } else if (this.node.$$filterState === FilterState.ON_FOUND_PATH) {
      cls += ' filter-on-path';
    }
    if (this.node.isSelected) {
      cls += ' highlight';
    }
    return cls;
  }

  onNodeRightClick(event: MouseEvent): void  {
    this.onSelectNode(this.node);
    this.nodeRightClick.emit({ event, node: this.node });
  }

}
