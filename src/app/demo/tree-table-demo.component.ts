import {Component, OnInit, OnDestroy} from '@angular/core';
import {TreeDataSource, Column, Settings, TreeTable} from '../../ng-data-table';
import {HttpClient} from '@angular/common/http';
import {TreeDemoService} from './tree-demo.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tree-table-demo',
  template: `<app-tree-table [treeTable]="treeTable"></app-tree-table>`
})
export class TreeTableDemoComponent implements OnInit, OnDestroy {

  public treeService: TreeDataSource;
  public treeTable: TreeTable;
  public settings: Settings;
  public columns: Column[] = <Column[]>[
    {
      title: 'Column',
      name: 'column',
      sortable: false,
      filter: false,
      frozen: false,
      resizeable: true,
      editable: true,
      width: 250,
    },
    {
      title: 'Cube_size',
      name: 'cube_size',
      sortable: false,
      filter: false,
      frozen: false,
      resizeable: true,
      editable: true,
      width: 250,
    },
    {
      title: 'Exp',
      name: 'exp',
      sortable: false,
      filter: false,
      frozen: false,
      resizeable: true,
      editable: true,
      width: 250,
    }
  ];

  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient) {
    this.treeService = new TreeDemoService(this.http);
    this.treeTable = new TreeTable(this.columns, this.settings, this.treeService);
  }

  ngOnInit() {
    const subSelection = this.treeTable.events.selectionSource$.subscribe(() => {
      console.log(this.treeTable.selectedNode);
    });
    this.subscriptions.push(subSelection);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
