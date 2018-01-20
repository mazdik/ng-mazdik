import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ITreeNode, ITreeService} from '../types';
import {ColumnModel} from '../models/column.model';

@Component({
  selector: 'tree-table-node',
  templateUrl: './tree-table-node.component.html',
})
export class TreeTableNodeComponent {

  @Input() public nodes: ITreeNode[];
  @Input() public service: ITreeService;
  @Input() public columns: ColumnModel[];
  @Input() public level: number = 0;
  @Input() public offsetX: number;
  @Output() requestNodes: EventEmitter<ITreeNode> = new EventEmitter();
  @Output() editComplete: EventEmitter<any> = new EventEmitter();

  loading: boolean = false;

  constructor() {
  }

  isLeaf(node: ITreeNode) {
    return node.leaf === false ? false : !(node.children && node.children.length);
  }

  onExpand(node: ITreeNode) {
    node.expanded = !node.expanded;
    if (node.expanded && (!node.children || node.children.length === 0) && node.leaf === false) {
      if (this.service) {
        this.loading = true;
        this.service.getNodes(node).then(data => {
          node.children = data;
          this.loading = false;
          this.requestNodes.emit(node);
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
    if (!this.isLeaf(node) && node.expanded) {
      icon = 'icon-node icon-collapsed';
    } else if (!this.isLeaf(node)) {
      icon = 'icon-node';
    }
    return icon;
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
