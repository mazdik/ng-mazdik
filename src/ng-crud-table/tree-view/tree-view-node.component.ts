import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {ITreeNode, ITreeService} from '../types/interfaces';

@Component({
  selector: 'tree-view-node',
  styleUrls: ['./tree-view.component.css'],
  template: `
    <li class="treenode" *ngIf="node">
      <i [class]="getIcon(node)"
         (click)="onExpand(node)">
      </i>
      <span class="treenode-content"
            (click)="onSelectNode(node)"
            (dblclick)="onExpand(node)"
            [ngClass]="{'highlight': isSelected(node)}">
        {{node.name}}
      </span>
      <ul class="tree-container" *ngIf="node.children && node.expanded">
        <tree-view-node
          *ngFor="let childNode of node.children"
          [node]="childNode"
          [service]="service"
          [selectedNode]="selectedNode"
          (selectedChanged)="onSelectNode($event)"
          (requestNodes)="onRequestLocal($event)">
        </tree-view-node>
      </ul>
    </li>
  `
})
export class TreeViewNodeComponent implements OnInit {

  @Input() public node: ITreeNode;
  @Input() public selectedNode: ITreeNode;
  @Input() public service: ITreeService;

  @Output() selectedChanged: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();
  @Output() requestNodes: EventEmitter<ITreeNode> = new EventEmitter();

  loading: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  isLeaf(node: ITreeNode) {
    return node.leaf === false ? false : !(node.children && node.children.length);
  }

  isSelected(node: ITreeNode) {
    return node === this.selectedNode;
  }

  onSelectNode(node: ITreeNode) {
    if (this.selectedNode !== node) {
      this.selectedNode = node;
      this.selectedChanged.emit(node);
    }
  }

  onExpand(node: ITreeNode) {
    node.expanded = !node.expanded;
    if (node.expanded && (!node.children || node.children.length === 0) && node.leaf === false) {
      this.requestNodes.emit(node);

      if (this.service) {
        this.loading = true;
        this.service.getNodes(node).then(data => {
          node.children = data;
          this.loading = false;
        }).catch(err => {
          this.loading = false;
        });
      }
    }
  }

  onRequestLocal(node: ITreeNode) {
    this.requestNodes.emit(node);
  }

  getIcon(node: ITreeNode) {
    let icon: string;
    if (this.loading) {
      return 'icon-collapsing';
    }
    if (node.icon) {
      icon = node.icon;
    } else if (!this.isLeaf(node) && node.expanded) {
      icon = 'icon-node icon-collapsed';
    } else if (!this.isLeaf(node)) {
      icon = 'icon-node';
    }
    return icon;
  }

}
