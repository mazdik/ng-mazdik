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

  @Output() onSelectedChanged: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();
  @Output() onRequestNodes: EventEmitter<ITreeNode> = new EventEmitter();

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
      this.onSelectedChanged.emit(node);
    }
  }

  onExpand(node: ITreeNode) {
    node.isExpanded = !node.isExpanded;
    if (node.isExpanded && (!node.children || node.children.length === 0)) {
      this.onRequestNodes.emit(node);
    }
  }

  onRequestLocal(node: ITreeNode) {
    this.onRequestNodes.emit(node);
  }

}
