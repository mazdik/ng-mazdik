import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable, DataSource, DataManager} from '../../ng-crud-table';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-virtual-scroll-demo',
  template: `<p>Client-side virtual scroll</p>
  <app-datatable [table]="table" [loading]="loading"></app-datatable>
  <p>Server-side virtual scroll</p>
  <app-crud-table [dataManager]="dataManager"></app-crud-table>
  `
})

export class VirtualScrollDemoComponent implements OnInit {

  public table: DataTable;
  public columns: Column[];
  public loading: boolean;
  public service: DataSource;
  public dataManager: DataManager;

  public settings: Settings = {
    virtualScroll: true
  };

  public serverSideSettings: Settings = {
    api: 'assets/players.json',
    virtualScroll: true
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
    this.loading = true;
    this.http.get('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.loading = false;
    });
  }

}
