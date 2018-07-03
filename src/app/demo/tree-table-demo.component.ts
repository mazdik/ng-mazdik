import {Component, OnInit} from '@angular/core';
import {TreeDataSource, Column, Settings, DataTable} from '../../ng-data-table';
import {HttpClient} from '@angular/common/http';
import {TreeDemoService} from './tree-demo.service';

@Component({
  selector: 'app-tree-table-demo',
  template: `
    <app-tree-table
      [service]="treeService"
      [table]="table"
      (editComplete)="onEditComplete($event)">
    </app-tree-table>`
})
export class TreeTableDemoComponent implements OnInit {

  public treeService: TreeDataSource;
  public table: DataTable;
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

  constructor(private http: HttpClient) {
    this.treeService = new TreeDemoService(this.http);
    this.table = new DataTable(this.columns, this.settings);
  }

  ngOnInit() {
  }

  onEditComplete(event) {
    console.log(event);
  }

}
