import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ITreeNode, Column} from '../types/interfaces';

@Component({
  selector: 'tree-table-node',
  templateUrl: './tree-table-node.component.html',
})
export class TreeTableNodeComponent {

  @Input() public nodes: ITreeNode[];
  @Input() public columns: Column[];
  @Input() public level: number = 0;
  @Input() public offsetX: number;
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

  stylesByGroup() {
    const styles: any = {};
    styles.left = `${this.offsetX}px`;
    return styles;
  }

}
