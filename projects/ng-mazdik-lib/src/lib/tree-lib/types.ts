import {TreeNode} from './tree-node';

export interface TreeDataSource {
  getNodes(node?: TreeNode): Promise<TreeNode[]>;
  searchNodes(name: string): Promise<any>;
}

export interface ITree {
  selectedNode: TreeNode;
  generateId(): number;
  loadNode(node: TreeNode): Promise<any>;
}

export enum FilterState {
  FOUND,
  ON_FOUND_PATH,
  NOT_FOUND
}
