import {DataTable, ColumnBase, Settings, Row} from '../ng-data-table/base';
import {Tree} from '../tree-lib/tree';
import {TreeNode} from '../tree-lib/tree-node';
import {TreeFlattener} from '../tree-lib/tree-flattener';
import {TreeDataSource} from '../tree-lib/types';
import {DtMessages} from '../dt-translate/dt-messages';

export class TreeTable extends DataTable {

  get service(): TreeDataSource { return this.tree.service; }
  set service(val: TreeDataSource) {
    this.tree.service = val;
  }

  get nodes(): TreeNode[] { return this.tree.nodes; }
  set nodes(val: TreeNode[]) {
    this.tree.nodes = val;
    this.flatten();
  }

  set serverSideFiltering(val: boolean) {
    this.tree.serverSideFiltering = val;
  }

  get filterLoading(): boolean {
    return this.tree.filterLoading;
  }

  getIconFunc: (node?: TreeNode) => string;
  indent: number = 10;
  readonly tree: Tree;
  private readonly treeFlattener: TreeFlattener;

  constructor(columns: ColumnBase[], settings: Settings, dataSource: TreeDataSource, messages?: DtMessages) {
    super(columns, settings, messages);
    this.tree = new Tree();
    this.tree.service = dataSource;
    this.treeFlattener = new TreeFlattener(this.transformer);
    this.pager.pageSizeOptions = [];
  }

  transformer = (node: TreeNode, level: number) => {
    const data = {
      expandable: !!node.expanded,
      $$level: level,
      node,
    };
    return Object.assign(data, node.data);
  }

  flatten() {
    this.rows = this.treeFlattener.flattenNodes(this.nodes);
    this.events.onRowsChanged();
  }

  getDescendants(row: Row) {
    const results = [];
    for (let i = row.$$index + 1; i < this.rows.length && row.$$level < this.rows[i].$$level; i++) {
      results.push(this.rows[i]);
    }
    return results;
  }

  selectionToggle(row: Row): void {
    let descendants = this.getDescendants(row);
    descendants = descendants.map(x => x.$$index);
    this.selection.isSelected(row.$$index)
      ? this.selection.select(...descendants)
      : this.selection.deselect(...descendants);
  }

}
