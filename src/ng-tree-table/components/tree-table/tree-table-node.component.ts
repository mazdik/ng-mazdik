import {Component, Input, OnInit} from '@angular/core';
import {TreeTable, TreeNode, translate} from '../../base';

@Component({
  selector: 'app-tree-table-node',
  templateUrl: './tree-table-node.component.html',
})
export class TreeTableNodeComponent implements OnInit {

  @Input() public treeTable: TreeTable;
  @Input() public node: TreeNode;
  @Input() public parentNode: TreeNode;

  public loading: boolean = false;

  constructor() {
  }

  ngOnInit() {
    if (!this.node.$$id) {
      this.node.$$id = this.treeTable.tree.id();
    }
    if (!this.node.$$level) {
      this.node.$$level = (this.parentNode) ? this.parentNode.$$level + 1 : 0;
    }
    if (!this.node.parent) {
      this.node.parent = this.parentNode;
    }
  }

  isLeaf(node: TreeNode) {
    return node.leaf === false ? false : !(node.children && node.children.length);
  }

  isSelected(node: TreeNode) {
    return (this.treeTable.tree.selectedNode && this.treeTable.tree.selectedNode.$$id === node.$$id);
  }

  onSelectNode(node: TreeNode) {
    if (this.treeTable.tree.selectedNode !== node) {
      this.treeTable.tree.selectedNode = node;
      this.treeTable.events.onSelectionChange();
    }
  }

  onExpand(node: TreeNode) {
    node.expanded = !node.expanded;
    if (node.expanded) {
      this.loading = true;
      this.treeTable.tree.loadNode(node).then(() => {
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    }
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

}
