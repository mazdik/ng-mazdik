import {TreeNode} from './tree-node';

export interface TreeDataSource {
  url: string;
  getNodes(node?: TreeNode): Promise<TreeNode[]>;
  searchNodes(name: string): Promise<any>;
}

export enum FilterState {
  FOUND,
  ON_FOUND_PATH,
  NOT_FOUND
}
