import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ITreeNode} from '../types/interfaces';

@Component({
  selector: 'tree-table-node',
  templateUrl: './tree-table-node.component.html'
})
export class TreeTableNodeComponent {

  @Input() nodes: ITreeNode[];
  @Output() onRequestNodes: EventEmitter<ITreeNode> = new EventEmitter();

  constructor() {
  }

  isLeaf(node: ITreeNode) {
    return node.leaf === false ? false : !(node.children && node.children.length);
  }

  onExpand(node: ITreeNode) {
    node.isExpanded = !node.isExpanded;
    if (node.isExpanded && (!node.children || node.children.length === 0)) {
      this.onRequestNodes.emit(node);
    }
  }


}
