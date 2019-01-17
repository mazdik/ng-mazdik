import {TreeNode} from './tree-node';

export class TreeHelper {

  static getExpanderIcon(node: TreeNode) {
    let icon: string;
    if (node.$$loading && !node.isLeaf()) {
      return 'dt-loader';
    }
    if (!node.isLeaf() && !node.expanded) {
      icon = 'dt-icon-node dt-icon-collapsed';
    } else if (!node.isLeaf()) {
      icon = 'dt-icon-node';
    }
    return icon;
  }

}
