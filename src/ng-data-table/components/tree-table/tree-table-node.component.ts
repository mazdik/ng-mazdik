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
  @Input() public node: TreeNode;
  @Input() public parentNode: TreeNode;
  @Input() public level: number = 0;
  @Output() requestNodes: EventEmitter<TreeNode> = new EventEmitter();

  public loading: boolean = false;

  constructor() {
  }

  ngOnInit() {
    if (!this.node.$$id) {
      this.node.$$id = this.treeTable.sequence.getUidRow();
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
    return (this.treeTable.selectedNode && this.treeTable.selectedNode.$$id === node.$$id);
  }

  onSelectNode(node: TreeNode) {
    if (this.treeTable.selectedNode !== node) {
      this.treeTable.selectedNode = node;
      this.treeTable.events.onSelectionChange();
    }
  }

  onExpand(node: TreeNode) {
    node.expanded = !node.expanded;
    if (node.expanded) {
      this.loadNode(node);
    }
  }

  loadNode(node: TreeNode) {
    if ((!node.children || node.children.length === 0) && node.leaf === false) {
      if (this.treeTable.service) {
        this.loading = true;
        this.treeTable.service.getNodes(node).then(data => {
          if (data && data.length) {
            data.forEach(n => {
              n.data.$$index = this.treeTable.sequence.getUidRow();
            });
          }
          this.loading = false;
          this.treeTable.addNode(node.$$id, data);
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

}
