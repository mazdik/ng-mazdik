import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {TreeNode, TreeDataSource} from '../../types';
import {Column, DataTable} from '../../base';
import {translate} from '../../base/util';

@Component({
  selector: 'app-tree-table-node',
  templateUrl: './tree-table-node.component.html',
})
export class TreeTableNodeComponent implements OnInit {

  @Input() public table: DataTable;
  @Input() public nodes: TreeNode[];
  @Input() public service: TreeDataSource;
  @Input() public columns: Column[];
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
      if (this.service) {
        this.loading = true;
        this.service.getNodes(node).then(data => {
          if (data && data.length) {
            data.forEach(n => {
              n.data.$$index = this.table.sequence.getUidRow();
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
    return translate(this.table.dimensions.offsetX, 0);
  }

}
