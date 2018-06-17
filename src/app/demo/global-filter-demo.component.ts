import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable, DataSource, DataManager} from '../../ng-crud-table';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-global-filter-demo',
  template: `<p>Client-side global filter</p>
  <app-datatable-toolbar [table]="table"></app-datatable-toolbar>
  <app-datatable [table]="table"></app-datatable>
  <p>Server-side global filter</p>
  <app-crud-table [dataManager]="dataManager"></app-crud-table>
  `
})

export class GlobalFilterDemoComponent implements OnInit {

  public table: DataTable;
  public service: DataSource;
  public columns: Column[];
  public dataManager: DataManager;

  public settings: Settings = {
    globalFilter: true,
  };

  public serverSideSettings: Settings = {
    api: 'assets/players.json',
    globalFilter: true
  };

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    for (const column of this.columns) {
      column.editable = false;
    }
    this.table = new DataTable(this.columns, this.settings);
    this.service = new DemoService(this.http, 10);
    this.dataManager = new DataManager(this.columns, this.serverSideSettings, this.service);
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

}
