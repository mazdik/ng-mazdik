import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings} from '../../lib/ng-data-table';
import {CdtSettings, DataTable, DataManager} from '../../lib/ng-crud-table';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-virtual-scroll-demo',
  template: `<p>Client-side virtual scroll with dynamic row height</p>
  <app-data-table [table]="table"></app-data-table>
  <p>Server-side virtual scroll</p>
  <app-crud-table [dataManager]="dataManager"></app-crud-table>
  `
})

export class VirtualScrollDemoComponent implements OnInit {

  table: DataTable;
  columns: Column[];
  dataManager: DataManager;

  settings: Settings = <Settings>{
    virtualScroll: true,
    rowHeightProp: '$$height',
  };

  serverSideSettings: CdtSettings = <CdtSettings>{
    virtualScroll: true,
  };

  constructor(private service: DemoService, private http: HttpClient) {
    this.columns = getColumnsPlayers();
    for (const column of this.columns) {
      column.editable = false;
    }
    this.table = new DataTable(this.columns, this.settings);
    this.dataManager = new DataManager(this.columns, this.serverSideSettings, this.service);
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get<any[]>('assets/players.json').subscribe(data => {
      for (const row of data) {
        row.$$height = (row.exp > 1000000) ? 40 : 25;
      }
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

}
