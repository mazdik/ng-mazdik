export class TreeNode {
  id: string;
  name: string;
  data?: any;
  icon?: string;
  expanded?: boolean;
  leaf?: boolean;
  parent?: TreeNode;

  set children (val: TreeNode[]) {
    this._children = [];
    if (val) {
      this._children = val.map((c) => new TreeNode(c, this, this.genUid));
    }
  }

  get children(): TreeNode[] {
    return this._children;
  }

  $$id?: number;
  $$level?: number;
  $$filterState?: number;

  private _children: TreeNode[];

  constructor(init: Partial<TreeNode>, parentNode: TreeNode, private genUid: () => number) {
    this.id = init.id;
    this.name = init.name;
    this.data = init.data;
    this.icon = init.icon;
    this.expanded = init.expanded;
    this.leaf = init.leaf;
    this.parent = parentNode;

    this.$$id = this.uid();
    this.$$level = (parentNode) ? parentNode.$$level + 1 : 0;

    this.children = init.children;
  }

  private uid(): number {
    if (this.genUid) {
      return this.genUid();
    } else {
      return Math.floor(Math.random() * 10000000000000);
    }
  }

  isLeaf(): boolean {
    return this.leaf === false ? false : !(this.children && this.children.length);
  }

}
