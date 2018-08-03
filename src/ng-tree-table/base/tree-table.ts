import {DataTable} from '../../ng-data-table/base/data-table';
import {ColumnBase} from '../../ng-data-table/base/column-base';
import {Settings} from '../../ng-data-table/base/settings';
import {Message} from '../../ng-data-table/base/message';
import {TreeNode, TreeDataSource} from './interface';
import {Tree} from './tree';

export class TreeTable extends DataTable {

  set service(val: TreeDataSource) {
    this.tree.service = val;
  }

  get service(): TreeDataSource {
    return this.tree.service;
  }

  set nodes(val: TreeNode[]) {
    this.tree.nodes = val;
  }

  get nodes(): TreeNode[] {
    return this.tree.nodes;
  }

  set serverSideFiltering(val: boolean) {
    this.tree.serverSideFiltering = val;
  }

  get filterLoading(): boolean {
    return this.tree.filterLoading;
  }

  public tree: Tree;

  constructor(columns: ColumnBase[], settings: Settings, dataSource: TreeDataSource, messages?: Message) {
    super(columns, settings, messages);
    this.tree = new Tree();
    this.tree.service = dataSource;
    this.tree.onLoadNodesFunc = this.setRowIndexes.bind(this);
  }

  setRowIndexes(nodes: TreeNode[]) {
    if (nodes && nodes.length) {
      nodes.forEach(n => {
        n.data.$$index = this.sequence.getUidRow();
        n.data.$$data = Object.assign({}, n.data);
        if (n.children) {
          this.setRowIndexes(n.children);
        }
      });
    }
  }

  getSelection() {
    return this.tree.selectedNode;
  }

}
