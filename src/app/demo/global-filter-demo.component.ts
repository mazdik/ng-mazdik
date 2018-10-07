import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, CdtSettings, DataTable, DataSource, DataManager} from '../../ng-crud-table';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-global-filter-demo',
  template: `<p>Client-side global filter</p>
  <dt-toolbar [table]="table"></dt-toolbar>
  <app-data-table [table]="table"></app-data-table>
  <p>Server-side global filter</p>
  <app-crud-table [dataManager]="dataManager"></app-crud-table>
  `
})

export class GlobalFilterDemoComponent implements OnInit {

  table: DataTable;
  service: DataSource;
  columns: Column[];
  dataManager: DataManager;

  settings: CdtSettings;
  serverSideSettings: CdtSettings = <CdtSettings>{
    globalFilter: true
  };

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    for (const column of this.columns) {
      column.editable = false;
    }
    this.table = new DataTable(this.columns, this.settings);
    this.service = new DemoService(this.http);
    this.service.url = 'assets/players.json';
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
