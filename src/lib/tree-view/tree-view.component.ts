import {Component, Input, Output, EventEmitter, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {TreeNode, Tree, TreeDataSource} from '../tree';
import {ContextMenuComponent, MenuEventArgs} from '../context-menu';

@Component({
  selector: 'app-tree-view',
  templateUrl: 'tree-view.component.html',
  styleUrls: [
    './tree-view.component.css',
    './tree-view.css',
    '../styles/clearable-input.css',
    '../styles/input.css',
    '../styles/spinners.css',
    '../styles/icons.css',
  ],
  encapsulation: ViewEncapsulation.None,
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
  @ViewChild('filterInput') filterInput: any;

  tree: Tree = new Tree();
  filterTimeout: any;
  loading: boolean;
  searchFilterText: any;

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
      this.contextMenu.show(<MenuEventArgs>{originalEvent: event['event'], data: event['node']});
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
    this.searchFilterText = '';
    this.onFilterKeyup();
  }

  getNodeById(nodeId: string) {
    return this.tree.getNodeById(nodeId);
  }

}
