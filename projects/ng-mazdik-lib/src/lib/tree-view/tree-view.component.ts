import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { TreeDataSource, Tree, TreeNode } from '../tree-lib';

@Component({
  selector: 'app-tree-view',
  templateUrl: 'tree-view.component.html',
})
export class TreeViewComponent implements OnInit {

  @Input()
  get service(): TreeDataSource { return this.tree.service; }
  set service(val: TreeDataSource) {
    this.tree.service = val;
    this.tree.nodes = [];
  }

  @Input()
  get nodes(): TreeNode[] { return this.tree.nodes; }
  set nodes(val: TreeNode[]) {
    this.tree.nodes = val;
  }

  @Input()
  set serverSideFiltering(val: boolean) {
    this.tree.serverSideFiltering = val;
  }

  @Input() filterDelay = 500;
  @Input() getIconFunc: (node?: TreeNode) => string;

  get filterLoading(): boolean {
    return this.tree.filterLoading;
  }

  @Output() selectedChanged: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  @Output() nodeRightClick: EventEmitter<any> = new EventEmitter();

  @ViewChild('filterInput', { static: false }) filterInput: any;

  tree: Tree = new Tree();
  filterTimeout: any;
  loading: boolean;
  searchFilterText: any = null;

  constructor() { }

  ngOnInit(): void  {
    this.initGetNodes();
  }

  initGetNodes(): void  {
    this.loading = true;
    this.tree.initLoadNodes().finally(() => { this.loading = false; });
  }

  onFilterInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.searchFilterText = element.value;
  }

  onFilterKeyup(): void {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.tree.filterTree(this.searchFilterText);
      this.filterTimeout = null;
    }, this.filterDelay);
  }

  onNodeRightClick(event): void  {
    this.nodeRightClick.emit({ originalEvent: event.event, data: event.node });
  }

  collapseAll(): void  {
    this.tree.collapseAll();
  }

  refresh(): void  {
    this.nodes = [];
    this.initGetNodes();
    this.tree.selectedNode = null;
    this.filterInput.nativeElement.value = null;
  }

  onClickClearSearch(): void  {
    this.searchFilterText = null;
    this.onFilterKeyup();
  }

  getNodeById(nodeId: string): TreeNode {
    return this.tree.getNodeById(nodeId);
  }

}
