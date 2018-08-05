import {DataTable} from '../../ng-data-table/base/data-table';
import {ColumnBase} from '../../ng-data-table/base/column-base';
import {Settings} from '../../ng-data-table/base/settings';
import {Message} from '../../ng-data-table/base/message';
import {TreeNode, TreeDataSource} from './interface';
import {Tree} from './tree';
import {TreeFlattener} from './tree-flattener';
import {Row} from './index';

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
  public treeFlattener: TreeFlattener;

  constructor(columns: ColumnBase[], settings: Settings, dataSource: TreeDataSource, messages?: Message) {
    super(columns, settings, messages);
    this.tree = new Tree();
    this.tree.service = dataSource;
    this.treeFlattener = new TreeFlattener(this.transformer);
  }

  transformer = (node: TreeNode, level: number) => {
    const data = {
      expandable: !!node.expanded,
      level: level,
      node: node,
    };
    return Object.assign(data, node.data);
  }

  flatten() {
    this.rows = this.treeFlattener.flattenNodes(this.nodes);
    this.events.onRowsChanged();
  }

  getDescendants(row: Row) {
    const results = [];
    for (let i = row.$$index + 1; i < this.rows.length && row.level < this.rows[i].level; i++) {
      results.push(this.rows[i]);
    }
    return results;
  }

}
