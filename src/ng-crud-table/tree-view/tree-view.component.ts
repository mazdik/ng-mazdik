import {Component, Input, Output, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {ITreeNode, ITreeService} from '../types/interfaces';
import {FilterState} from '../types/enums';
import {id} from '../utils/id';

@Component({
  selector: 'tree-view',
  styleUrls: ['./tree-view.component.css'],
  template: `
    <input #filterInput type="text" placeholder="Search" (keyup)="onFilterKeyup($event)">
    <ul class="tree-container">
      <tree-view-node
        *ngFor="let node of nodes"
        [node]="node"
        [service]="service"
        [selectedNode]="selectedNode"
        (selectedChanged)="onSelectedChanged($event)"
        (requestNodes)="onRequestNodes($event)">
      </tree-view-node>
    </ul>
  `
})
export class TreeViewComponent implements OnInit {

  @Input()
  set nodes(val: ITreeNode[]) {
    if (val) {
      for (const node of val) {
        if (!node.$$id) {
          node.$$id = id();
        }
      }
    }
    this._nodes = val;
  }

  get nodes(): ITreeNode[] {
    return this._nodes;
  }

  @Input() public selectedNode: ITreeNode;
  @Input() public service: ITreeService;

  @Output() selectedChanged: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();
  @Output() requestNodes: EventEmitter<any> = new EventEmitter();

  private _nodes: ITreeNode[];
  @ViewChild('filterInput') filterInput: any;
  filterTimeout: any;

  constructor() {
  }

  ngOnInit() {
  }

  onSelectedChanged(event) {
    this.selectedChanged.emit(event);
  }

  onRequestNodes(event) {
    this.requestNodes.emit(event);
    this.addNode(event.parentId, event.children);
  }

  doForAll(fn: (node: ITreeNode) => any) {
    this.doForEach(this.nodes, fn);
  }

  doForEach(nodes: ITreeNode[], fn: (node: ITreeNode) => any) {
    nodes.forEach((node: ITreeNode) => {
      Promise.resolve(fn(node)).then(() => {
        if (node.children) {
          this.doForEach(node.children, fn);
        }
      });
    });
  }

  expandAll() {
    this.doForAll((node) => {
      node.expanded = true;
    });
  }

  collapseAll() {
    this.doForAll((node) => {
      node.expanded = false;
    });
  }

  addNode(nodeId: string, children: ITreeNode[]) {
    this.nodes.forEach((node) => {
      this._addNode(node, nodeId, children);
    });
  }

  private _addNode(node: ITreeNode, nodeId: string, children: ITreeNode[]) {
    if (node.$$id === nodeId) {
      node.children = children;
      return true;
    } else if (node.children) {
      node.children.forEach((child) => {
        this._addNode(child, nodeId, children);
      });
    }
  }

  onFilterKeyup(event) {
    const value = event.target.value;
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filterTree(value);
      this.filterTimeout = null;
    }, 300);
  }

  filterTree(filterValue: string) {
    this.filterClientSide(filterValue);
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
    });
  }

}
