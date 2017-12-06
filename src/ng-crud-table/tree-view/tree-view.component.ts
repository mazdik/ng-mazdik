import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {ITreeNode, ITreeService} from '../types/interfaces';
import {id} from '../utils/id';

@Component({
  selector: 'tree-view',
  styleUrls: ['./tree-view.component.css'],
  template: `
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

  constructor() {
  }

  ngOnInit() {
  }

  onSelectedChanged(event) {
    this.selectedChanged.emit(event);
  }

  onRequestNodes(event) {
    this.requestNodes.emit(event);
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

}
