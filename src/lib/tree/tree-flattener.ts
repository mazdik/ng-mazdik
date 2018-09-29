import {TreeNode} from './tree-node';

export class TreeFlattener {

    constructor(public transformFunction: (node: TreeNode, level: number) => any) {}

    _flattenNode(node: TreeNode, level: number, resultNodes: any[], parentMap: boolean[]) {
      const flatNode = this.transformFunction(node, level);
      resultNodes.push(flatNode);

      if (flatNode.expandable) {
        const childrenNodes = node.children;
        if (Array.isArray(childrenNodes)) {
          this._flattenChildren(childrenNodes, level, resultNodes, parentMap);
        } else {
            this._flattenChildren(childrenNodes[0], level, resultNodes, parentMap);
        }
      }
      return resultNodes;
    }

    _flattenChildren(children: TreeNode[], level: number, resultNodes: any[], parentMap: boolean[]) {
      children.forEach((child, index) => {
        const childParentMap: boolean[] = parentMap.slice();
        childParentMap.push(index !== children.length - 1);
        this._flattenNode(child, level + 1, resultNodes, childParentMap);
      });
    }

    flattenNodes(structuredData: TreeNode[]) {
      const resultNodes: any[] = [];
      structuredData.forEach(node => this._flattenNode(node, 0, resultNodes, []));
      return resultNodes;
    }

  }
