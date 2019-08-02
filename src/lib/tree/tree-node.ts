import { ITree } from './types';

export class TreeNode {
  id: string;
  name: string;
  data?: any;
  icon?: string;
  expanded?: boolean;
  leaf?: boolean;
  parent?: TreeNode;

  get children(): TreeNode[] { return this._children; }
  set children(val: TreeNode[]) {
    this._children = [];
    if (val) {
      this._children = val.map((c) => new TreeNode(c, this, this.tree));
    }
  }
  private _children: TreeNode[];

  $$id?: number;
  $$level?: number;
  $$filterState?: number;
  $$loading?: boolean;

  constructor(init: Partial<TreeNode>, parentNode: TreeNode, public tree: ITree) {
    this.id = init.id;
    this.name = init.name;
    this.data = init.data;
    this.icon = init.icon;
    this.expanded = init.expanded;
    this.leaf = init.leaf;
    this.parent = parentNode;

    this.$$id = this.tree.generateId();
    this.$$level = (parentNode) ? parentNode.$$level + 1 : 0;

    this.children = init.children;
  }

  get path(): string[] {
    return this.parent ? [...this.parent.path, this.id] : [];
  }

  get hasChildren(): boolean {
    return (this.children && this.children.length > 0);
  }

  get isSelected() {
    return this === this.tree.selectedNode;
  }

  isLeaf(): boolean {
    return this.leaf === false ? false : !this.hasChildren;
  }

  ensureVisible() {
    if (this.parent) {
      this.parent.expanded = true;
      this.parent.ensureVisible();
    }
    return this;
  }

}
