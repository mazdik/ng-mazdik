import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {ITreeNode} from '../types/interfaces';

@Component({
  selector: 'tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent implements OnInit {

  @Input() nodes: ITreeNode[];
  @Input() selectedNode: ITreeNode;

  @Output() selectedChanged: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();
  @Output() requestNodes: EventEmitter<ITreeNode> = new EventEmitter();

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
    }
  }

  onRequestLocal(node: ITreeNode) {
    this.requestNodes.emit(node);
  }

  getIcon(node: ITreeNode) {
    let icon: string;

    if (node.icon) {
      icon = node.icon;
    } else if (!this.isLeaf(node) && node.expanded) {
      icon = 'icon-node icon-collapsed';
    } else if (!this.isLeaf(node)) {
      icon = 'icon-node';
    }
    return 'indicator ' + icon;
  }

}
