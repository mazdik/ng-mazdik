export interface TreeNode {
  id: string;
  name: string;
  data: any;
  children?: TreeNode[];
  expanded?: boolean;
  leaf?: boolean;
  parent?: TreeNode;
  icon?: string;
  $$id?: number;
  $$filterState?: number;
  $$level?: number;
}

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
