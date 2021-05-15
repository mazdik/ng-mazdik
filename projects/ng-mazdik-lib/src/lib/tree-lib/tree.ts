import { TreeNode } from './tree-node';
import { TreeDataSource, FilterState, ITree } from './types';
import { isBlank } from '../common/utils';

export class Tree implements ITree {

  service: TreeDataSource;
  selectedNode: TreeNode;
  filterLoading: boolean;
  serverSideFiltering: boolean;
  filterLoadingFunc: (state: boolean) => void;

  get nodes(): TreeNode[] { return this._nodes; }
  set nodes(val: TreeNode[]) {
    this._nodes = [];
    for (const node of val) {
      this._nodes.push(new TreeNode(node, null, this));
    }
  }
  private _nodes: TreeNode[];

  private uidNode = 0;

  constructor() {
  }

  generateId(): number {
    return this.uidNode++;
  }

  initLoadNodes(): Promise<any> {
    if (this.service && !(this.nodes && this.nodes.length)) {
      return this.service.getNodes().then(data => {
        this.nodes = data;
      });
    } else {
      return Promise.resolve();
    }
  }

  loadNode(node: TreeNode): Promise<any> {
    if ((!node.children || node.children.length === 0) && node.leaf === false && this.service) {
      return this.service.getNodes(node).then(data => {
        this.addNode(node.$$id, data);
      });
    } else {
      return Promise.resolve();
    }
  }

  addNode(nodeId: number, children: TreeNode[]): void {
    this.nodes.forEach((node) => {
      this._addNode(node, nodeId, children);
    });
  }

  private _addNode(node: TreeNode, nodeId: number, children: TreeNode[]): boolean {
    if (node.$$id === nodeId) {
      node.children = children;
      return true;
    } else if (node.children) {
      node.children.forEach((child) => {
        this._addNode(child, nodeId, children);
      });
    }
    return false;
  }

  doForAll(fn: (node: TreeNode) => any): Promise<any> {
    return this.doForEach(this.nodes, fn);
  }

  filterTree(filterValue: string): Promise<any> {
    if (this.serverSideFiltering) {
      return this.filterServerSide(filterValue);
    } else {
      this.filterClientSide(filterValue);
      return Promise.resolve();
    }
  }

  filterClientSide(filterValue: string): void  {
    if (!filterValue.trim()) {
      this.clearSearchState();
      return;
    }

    const searchNode = (node: TreeNode): boolean => {
      let expandUp = false;
      const index = node.name.toLowerCase().indexOf(filterValue.toLowerCase());
      if (index >= 0) {
        node.$$filterState = FilterState.FOUND;
        expandUp = true;
      } else {
        node.$$filterState = FilterState.NOT_FOUND;
        node.expanded = false;
        expandUp = false;
      }

      if (node.children) {
        const childState = node.children.map(searchNode).find((state: boolean) => state);
        if (childState) {
          if (node.$$filterState !== FilterState.FOUND) {
            node.$$filterState = FilterState.ON_FOUND_PATH;
          }
          node.expanded = true;
          expandUp = true;
        }
      }
      return expandUp;
    };

    if (this.nodes) {
      this.nodes.forEach(searchNode);
    }
  }

  clearSearchState(): Promise<any> {
    return this.doForAll((node: TreeNode) => {
      node.$$filterState = null;
      node.expanded = false;
    });
  }

  getNodeById(nodeId: string): TreeNode {
    return this.getNodeBy(node => node.id && node.id.toString() === nodeId.toString());
  }

  getNodeBy(predicate, startNode = null): TreeNode {
    startNode = startNode || { children: this.nodes };
    if (!startNode.children) {
      return null;
    }

    const found = startNode.children.find(predicate);

    if (found) {
      return found;
    } else {
      for (const child of startNode.children) {
        const foundInChildren = this.getNodeBy(predicate, child);
        if (foundInChildren) {
          return foundInChildren;
        }
      }
      return null;
    }
  }

  getChildren(node: TreeNode): Promise<any> {
    if ((!node.children || node.children.length === 0) && node.leaf === false) {
      return this.service.getNodes(node).then(data => {
        node.children = data;
      });
    } else {
      return Promise.resolve();
    }
  }

  doForEach(nodes: TreeNode[], fn: (node: TreeNode) => any): Promise<any> {
    return Promise.all(nodes.map((node) => {
      return Promise.resolve(fn(node)).then(() => {
        return (node.children) ? this.doForEach(node.children, fn) : null;
      });
    }, this));
  }

  expandAll(): void  {
    this.doForEach(this.nodes, (node) => {
      node.expanded = true;
      return this.getChildren(node);
    }).then();
  }

  collapseAll(): void  {
    this.doForEach(this.nodes, (node) => {
      node.expanded = false;
    }).then();
  }

  loadPath(path: any[]): Promise<any> {
    if (path && path.length) {
      return Promise.all(path.map((p) => {
        return this.doForEach(this.nodes, (node) => (node.id === p) ? this.getChildren(node) : null);
      }, this)).then(() => {
        path.shift();
        return this.loadPath(path);
      });
    } else {
      return Promise.resolve();
    }
  }

  filterServerSide(filterValue: string): Promise<any> {
    if (isBlank(filterValue)) {
      return this.clearSearchState();
    }
    if (this.service) {
      this.filterLoading = true;
      if (this.filterLoadingFunc) {
        this.filterLoadingFunc(true);
      }
      return this.service.searchNodes(filterValue).then(items => {
        return this.loadPath(items).then(() => {
          this.filterClientSide(filterValue);
          this.filterLoading = false;
          if (this.filterLoadingFunc) {
            this.filterLoadingFunc(false);
          }
        });
      });
    }
    return null;
  }

}
