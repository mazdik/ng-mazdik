import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-crud-table';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-data-table-demo',
  template: `
    <app-datatable-toolbar [table]="table"></app-datatable-toolbar>
    <app-datatable [table]="table"></app-datatable>
  `
})

export class DataTableDemoComponent implements OnInit {

  public table: DataTable;
  public columns: Column[];

  public settings: Settings = <Settings>{
    clientSide: true,
    columnResizeMode: 'aminated',
    globalFilter: true,
    exportAction: true,
  };

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    this.table = new DataTable(this.columns, this.settings);
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

}
