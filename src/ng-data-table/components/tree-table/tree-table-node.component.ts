import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {TreeNode} from '../../types';
import {TreeTable} from '../../base';
import {translate} from '../../base/util';

@Component({
  selector: 'app-tree-table-node',
  templateUrl: './tree-table-node.component.html',
})
export class TreeTableNodeComponent implements OnInit {

  @Input() public treeTable: TreeTable;
  @Input() public nodes: TreeNode[];
  @Input() public level: number = 0;
  @Output() requestNodes: EventEmitter<TreeNode> = new EventEmitter();

  public loading: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  isLeaf(node: TreeNode) {
    return node.leaf === false ? false : !(node.children && node.children.length);
  }

  onExpand(node: TreeNode) {
    node.expanded = !node.expanded;
    if (node.expanded && (!node.children || node.children.length === 0) && node.leaf === false) {
      if (this.treeTable.service) {
        this.loading = true;
        this.treeTable.service.getNodes(node).then(data => {
          if (data && data.length) {
            data.forEach(n => {
              n.data.$$index = this.treeTable.sequence.getUidRow();
            });
          }
          node.children = data;
          this.loading = false;
          this.requestNodes.emit(node);
        }).catch(err => {
          this.loading = false;
        });
      }
    }
  }

  onRequestLocal(node: TreeNode) {
    this.requestNodes.emit(node);
  }

  getIcon(node: TreeNode) {
    let icon: string;
    if (this.loading && !this.isLeaf(node)) {
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
    return translate(this.treeTable.dimensions.offsetX, 0);
  }

  isSelected(node: TreeNode) {
    return (this.treeTable.selectedNode && this.treeTable.selectedNode.$$id === node.$$id);
  }

}
