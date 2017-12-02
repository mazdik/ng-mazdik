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
  @Output() requestNodes: EventEmitter<ITreeNode> = new EventEmitter();
  @Output() editComplete: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  isLeaf(node: ITreeNode) {
    return node.leaf === false ? false : !(node.children && node.children.length);
  }

  onExpand(node: ITreeNode) {
    node.expanded = !node.expanded;
    if (node.expanded && (!node.children || node.children.length === 0)) {
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

  stylesByGroup() {
    const styles: any = {};
    styles.left = `${this.offsetX}px`;
    return styles;
  }

  columnTrackingFn(index: number, column: any): any {
    return column.name;
  }

  onCellEditComplete(event) {
    this.editComplete.emit(event);
  }

}
