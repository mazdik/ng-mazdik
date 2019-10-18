import {Component, Input, Output, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {TreeDataSource, Tree, TreeNode} from '../tree-lib';
import {MenuEventArgs} from '../context-menu/types';
import {ContextMenuComponent} from '../context-menu/context-menu.component';

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

  @Input() contextMenu: ContextMenuComponent;
  @Input() filterDelay = 500;
  @Input() getIconFunc: (node?: TreeNode) => string;

  get filterLoading(): boolean {
    return this.tree.filterLoading;
  }

  @Output() selectedChanged: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  @ViewChild('filterInput', {static: false}) filterInput: any;

  tree: Tree = new Tree();
  filterTimeout: any;
  loading: boolean;
  searchFilterText: any = null;

  constructor() {}

  ngOnInit() {
    this.initGetNodes();
  }

  initGetNodes() {
    this.loading = true;
    this.tree.initLoadNodes().finally(() => { this.loading = false; });
  }

  onFilterKeyup() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.tree.filterTree(this.searchFilterText);
      this.filterTimeout = null;
    }, this.filterDelay);
  }

  onNodeRightClick(event) {
    if (this.contextMenu) {
      this.contextMenu.show({originalEvent: event.event, data: event.node} as MenuEventArgs);
    }
  }

  collapseAll() {
    this.tree.collapseAll();
  }

  refresh() {
    this.nodes = [];
    this.initGetNodes();
    this.tree.selectedNode = null;
    this.filterInput.nativeElement.value = null;
  }

  onClickClearSearch() {
    this.searchFilterText = null;
    this.onFilterKeyup();
  }

  getNodeById(nodeId: string) {
    return this.tree.getNodeById(nodeId);
  }

}
