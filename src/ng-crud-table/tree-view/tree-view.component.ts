import {Component, Input, Output, EventEmitter, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ITreeNode, ITreeService} from '../types/interfaces';
import {FilterState} from '../types/enums';
import {id} from '../utils/id';

@Component({
  selector: 'tree-view',
  styleUrls: ['./tree-view.component.css', '../styles/index.css'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="tree-header">
      <button class="button button-sm" (click)="collapseAll()"><i class="icon icon-return"></i></button>
      <button class="button button-sm" (click)="refresh()"><i class="icon icon-reload"></i></button>
      <div class="clearable-input tree-filter-input">
        <input type="text"
               class="df-control"
               placeholder="Search"
               #filterInput
               [(ngModel)]="searchFilterText"
               (keyup)="onFilterKeyup()">
        <span [style.display]="searchFilterText?.length > 0 ? 'block' : 'none' "
              (click)="onClickClearSearch()">&times;</span>
      </div>
      <i class="icon-collapsing" [style.visibility]="!filterLoading ? 'hidden' : 'visible' "></i>
    </div>
    <div class="tree-body">
      <div *ngIf="loading" class="loading-content"><i class="icon-collapsing"></i></div>
      <ul class="tree-container" style="padding-left: 0;">
        <tree-view-node
          *ngFor="let node of nodes"
          [node]="node"
          [service]="service"
          [selectedNode]="selectedNode"
          (selectedChanged)="onSelectedChanged($event)"
          (requestNodes)="onRequestNodes($event)"
          (nodeRightClick)="onNodeRightClick($event)">
        </tree-view-node>
      </ul>
    </div>
  `
})
export class TreeViewComponent implements OnInit {

  @Input() public selectedNode: ITreeNode;
  @Input() public service: ITreeService;
  @Input() public serverSideFiltering: boolean;
  @Input() public contextMenu: any;
  @Input() filterDelay: number = 500;
  @Output() selectedChanged: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();
  @Output() requestNodes: EventEmitter<any> = new EventEmitter();
  @ViewChild('filterInput') filterInput: any;
  filterTimeout: any;
  filterLoading: boolean = false;
  loading: boolean = false;
  searchFilterText: any;

  constructor() {
  }

  private _nodes: ITreeNode[];

  get nodes(): ITreeNode[] {
    return this._nodes;
  }

  @Input()
  set nodes(val: ITreeNode[]) {
    if (val) {
      for (const node of val) {
        if (!node.$$id) {
          node.$$id = id();
        }
        if (!node.$$level) {
          node.$$level = 1;
        }
      }
    }
    this._nodes = val;
  }

  ngOnInit() {
    this.initGetNodes();
  }

  initGetNodes() {
    if (this.service && !(this.nodes && this.nodes.length)) {
      this.loading = true;
      this.service.getNodes().then(data => {
        this.nodes = data;
        this.loading = false;
      }).then(() => {
        this.loading = false;
      });
    }
  }

  onSelectedChanged(event) {
    this.selectedChanged.emit(event);
  }

  onRequestNodes(event) {
    this.requestNodes.emit(event);
    this.addNode(event.parentId, event.children);
  }

  doForAll(fn: (node: ITreeNode) => any) {
    this.doForEach(this.nodes, fn).then();
  }

  addNode(nodeId: string, children: ITreeNode[]) {
    this.nodes.forEach((node) => {
      this._addNode(node, nodeId, children);
    });
  }

  private _addNode(node: ITreeNode, nodeId: string, children: ITreeNode[]) {
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

  onFilterKeyup() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filterTree(this.searchFilterText);
      this.filterTimeout = null;
    }, this.filterDelay);
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

    const searchNode = (node: ITreeNode): boolean => {
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
    this.doForAll((node: ITreeNode) => {
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

  setNodeChildDefaults(node: ITreeNode) {
    if (node.children) {
      for (const child of node.children) {
        if (!child.$$id) {
          child.$$id = id();
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

  getChildren(node: ITreeNode) {
    if ((!node.children || node.children.length === 0) && node.leaf === false) {
      return this.service.getNodes(node).then(data => {
        node.children = data;
        this.setNodeChildDefaults(node);
      });
    } else {
      return Promise.resolve();
    }
  }

  doForEach(nodes: ITreeNode[], fn: (node: ITreeNode) => any) {
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

  onNodeRightClick(event) {
    if (this.contextMenu) {
      this.contextMenu.show(event['event']);
    }
  }

  refresh() {
    this.nodes = [];
    this.initGetNodes();
    this.selectedNode = null;
    this.filterInput.nativeElement.value = null;
  }

  onClickClearSearch() {
    this.searchFilterText = '';
    this.onFilterKeyup();
  }

}
