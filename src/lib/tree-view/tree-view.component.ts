import {Component, Input, Output, EventEmitter, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {TreeNode, Tree, TreeDataSource} from '../tree';

@Component({
  selector: 'app-tree-view',
  styleUrls: ['./tree-view.component.css', './tree-view.css', '../styles/clearable-input.css'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="tree-header">
      <button class="tree-button" (click)="collapseAll()"><i class="icon icon-return"></i></button>
      <button class="tree-button" (click)="refresh()"><i class="icon icon-reload"></i></button>
      <div class="clearable-input tree-filter-input">
        <input class="tree-input"
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
      <div *ngIf="loading" class="tree-loading-content"><i class="icon-collapsing"></i></div>
      <ul class="tree-container" style="padding-left: 0;">
        <app-tree-view-node
          *ngFor="let node of nodes"
          [node]="node"
          [getIconFunc]="getIconFunc"
          (selectedChanged)="selectedChanged.emit($event)"
          (nodeRightClick)="onNodeRightClick($event)">
        </app-tree-view-node>
      </ul>
    </div>
  `
})
export class TreeViewComponent implements OnInit {

  @Input()
  set service(val: TreeDataSource) {
    this.tree.service = val;
    this.tree.nodes = [];
  }

  get service(): TreeDataSource {
    return this.tree.service;
  }

  @Input()
  set nodes(val: TreeNode[]) {
    this.tree.nodes = val;
  }

  get nodes(): TreeNode[] {
    return this.tree.nodes;
  }

  @Input()
  set serverSideFiltering(val: boolean) {
    this.tree.serverSideFiltering = val;
  }

  @Input() contextMenu: any;
  @Input() filterDelay = 500;
  @Input() getIconFunc: (node?: TreeNode) => string;

  get filterLoading(): boolean {
    return this.tree.filterLoading;
  }

  @Output() selectedChanged: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  @ViewChild('filterInput') filterInput: any;

  filterTimeout: any;
  loading: boolean;
  searchFilterText: any;

  constructor(private tree: Tree) {
  }

  ngOnInit() {
    this.initGetNodes();
  }

  initGetNodes() {
    this.loading = true;
    this.tree.initLoadNodes().then(() => {
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
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
      this.contextMenu.show(event['event']);
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

}
