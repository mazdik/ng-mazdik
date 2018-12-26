import {TreeNode } from './tree-node';

export class TreeBuilder {

  static rowsToTree(rows: any[], from: string, to: string): TreeNode[] {
    const map = {};
    const roots: TreeNode[] = [];

    for (let i = 0; i < rows.length; i++) {
      const id = rows[i][to];
      map[id] = <TreeNode>{
        id: id,
        name: (rows[i].name) ? rows[i].name : null,
        data: Object.assign({}, rows[i]),
        icon: (rows[i].icon) ? rows[i].icon : null,
        children: [],
      };
    }

    for (let i = 0; i < rows.length; i++) {
      const id = rows[i][to];
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
