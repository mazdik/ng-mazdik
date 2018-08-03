import {Injectable} from '@angular/core';
import {TreeNode, TreeDataSource, FilterState} from './interface';

@Injectable()
export class Tree {

  public service: TreeDataSource;
  public selectedNode: TreeNode;
  public filterLoading: boolean;
  public serverSideFiltering: boolean;
  public onLoadNodesFunc: Function;

  set nodes(val: TreeNode[]) {
    if (val) {
      for (const node of val) {
        if (!node.$$id) {
          node.$$id = this.id();
        }
        if (!node.$$level) {
          node.$$level = 1;
        }
      }
      if (this.onLoadNodesFunc) {
        this.onLoadNodesFunc(val);
      }
    }
    this._nodes = val;
  }

  get nodes(): TreeNode[] {
    return this._nodes;
  }

  private _nodes: TreeNode[];
  private uidNode: number = 0;

  constructor() {
  }

  id(): number {
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
    if ((!node.children || node.children.length === 0) && node.leaf === false) {
      if (this.service) {
        return this.service.getNodes(node).then(data => {
          this.addNode(node.$$id, data);
          if (this.onLoadNodesFunc) {
            this.onLoadNodesFunc(data);
          }
        });
      }
    } else {
      return Promise.resolve();
    }
  }

  addNode(nodeId: number, children: TreeNode[]) {
    this.nodes.forEach((node) => {
      this._addNode(node, nodeId, children);
    });
  }

  private _addNode(node: TreeNode, nodeId: number, children: TreeNode[]) {
    if (node.$$id === nodeId) {
      node.children = children;
      this.setNodeChildDefaults(node);
      return true;
    } else if (node.children) {
      node.children.forEach((child) => {
        this._addNode(child, nodeId, children);
      });
    }
  }

  setNodeChildDefaults(node: TreeNode) {
    if (node.children) {
      for (const child of node.children) {
        if (!child.$$id) {
          child.$$id = this.id();
        }
        if (!child.$$level) {
          child.$$level = node.$$level + 1;
        }
        if (!child.parent) {
          child.parent = node;
        }
      }
    }
  }

  doForAll(fn: (node: TreeNode) => any) {
    this.doForEach(this.nodes, fn).then();
  }

  filterTree(filterValue: string) {
    if (this.serverSideFiltering) {
      this.filterServerSide(filterValue);
    } else {
      this.filterClientSide(filterValue);
    }
  }

  filterClientSide(filterValue: string) {
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

  clearSearchState() {
    this.doForAll((node: TreeNode) => {
      node.$$filterState = null;
      node.expanded = false;
    });
  }

  getNodeById(nodeId) {
    const idStr = nodeId.toString();
    return this.getNodeBy((node) => node.id.toString() === idStr);
  }

  getNodeBy(predicate, startNode = null) {
    startNode = startNode || {'children': this.nodes};
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
    }
  }

  getChildren(node: TreeNode) {
    if ((!node.children || node.children.length === 0) && node.leaf === false) {
      return this.service.getNodes(node).then(data => {
        node.children = data;
        this.setNodeChildDefaults(node);
        if (this.onLoadNodesFunc) {
          this.onLoadNodesFunc(data);
        }
      });
    } else {
      return Promise.resolve();
    }
  }

  doForEach(nodes: TreeNode[], fn: (node: TreeNode) => any) {
    return Promise.all(nodes.map((node) => {
      return Promise.resolve(fn(node)).then(() => {
        if (node.children) {
          return this.doForEach(node.children, fn);
        }
      });
    }, this));
  }

  expandAll() {
    this.doForEach(this.nodes, (node) => {
      node.expanded = true;
      this.setNodeChildDefaults(node);
      return this.getChildren(node);
    }).then();
  }

  collapseAll() {
    this.doForEach(this.nodes, (node) => {
      node.expanded = false;
    }).then();
  }

  loadPath(path: any[]) {
    if (path && path.length) {
      return Promise.all(path.map((p) => {
        return this.doForEach(this.nodes, (node) => {
          if (node.id === p) {
            this.setNodeChildDefaults(node);
            return this.getChildren(node);
          }
        });
      }, this)).then(() => {
        path.shift();
        return this.loadPath(path);
      });
    } else {
      return Promise.resolve();
    }
  }

  filterServerSide(filterValue: string) {
    if (!filterValue.trim()) {
      this.clearSearchState();
      return;
    }
    if (this.service) {
      this.filterLoading = true;
      this.service.searchNodes(filterValue).then(items => {
        this.loadPath(items).then(() => {
          this.filterClientSide(filterValue);
          this.filterLoading = false;
        });
      });
    }
  }

}
