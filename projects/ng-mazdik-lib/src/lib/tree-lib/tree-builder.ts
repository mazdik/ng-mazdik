import {TreeNode } from './tree-node';

export class TreeBuilder {

  static rowsToTree(rows: any[], from: string, to: string): TreeNode[] {
    const map = {};
    const roots: TreeNode[] = [];

    for (const row of rows) {
      const id = row[to];
      map[id] = {
        id,
        name: (row.name) ? row.name : null,
        data: Object.assign({}, row),
        icon: (row.icon) ? row.icon : null,
        children: [],
      } as TreeNode;
    }

    for (const row of rows) {
      const id = row[to];
      const node = map[id];
      const parentId = node.data[from];
      if (parentId !== 0) {
        map[parentId].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

}
