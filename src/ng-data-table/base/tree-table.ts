import {DataTable} from './data-table';
import {ColumnBase} from './column-base';
import {Settings} from './settings';
import {Message} from './message';
import {TreeNode, TreeDataSource} from '../types';

export class TreeTable extends DataTable {

  public service: TreeDataSource;
  public selectedNode: TreeNode;

  set nodes(val: TreeNode[]) {
    if (val) {
      for (const node of val) {
        if (!node.$$id) {
          node.$$id = this.sequence.getUidRow();
        }
        if (!node.$$level) {
          node.$$level = 1;
        }
        this.setNodeChildDefaults(node);
      }
      this.setRowIndexes(val);
    }
    this._nodes = val;
  }

  get nodes(): TreeNode[] {
    return this._nodes;
  }

  private _nodes: TreeNode[];

  constructor(columns: ColumnBase[], settings: Settings, dataSource: TreeDataSource, messages?: Message) {
    super(columns, settings, messages);
    this.service = dataSource;
  }

  initGetNodes() {
    if (this.service && !(this.nodes && this.nodes.length)) {
      this.service.getNodes().then(data => {
        this.nodes = data;
      });
    }
  }

  setRowIndexes(nodes: TreeNode[]) {
    if (nodes && nodes.length) {
      nodes.forEach(n => {
        n.data.$$index = this.sequence.getUidRow();
        if (n.children) {
          this.setRowIndexes(n.children);
        }
      });
    }
  }

  addNode(nodeId: number, children: TreeNode[]) {
    this.nodes.forEach((node) => {
      this._addNode(node, nodeId, children);
    });
  }

  private _addNode(node: TreeNode, nodeId: number, children: TreeNode[]) {
    if (node.$$id === nodeId) {
      node.children = children;
      this.setNodeChildDefaults(node);
      return true;
    } else if (node.children) {
      node.children.forEach((child) => {
        this._addNode(child, nodeId, children);
      });
    }
  }

  setNodeChildDefaults(node: TreeNode) {
    if (node.children) {
      for (const child of node.children) {
        if (!child.$$id) {
          child.$$id = this.sequence.getUidRow();
        }
        if (!child.$$level) {
          child.$$level = node.$$level + 1;
        }
        if (!child.parent) {
          child.parent = node;
        }
      }
    }
  }

}
