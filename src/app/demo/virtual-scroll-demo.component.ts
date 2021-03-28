import { Component, OnInit } from '@angular/core';
import { Settings, CdtSettings, DataTable, DataManager } from 'ng-mazdik-lib';
import { DemoService } from './demo.service';
import { getColumnsPlayers } from './columns';

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
  dataManager: DataManager;

  settings: Settings = new Settings({
    virtualScroll: true,
    rowHeightProp: '$$height',
  });

  serverSideSettings: CdtSettings = new CdtSettings({
    virtualScroll: true,
  });

  constructor(private service: DemoService) {
    const columns = getColumnsPlayers();
    this.table = new DataTable(columns, this.settings);
    this.dataManager = new DataManager(columns, this.serverSideSettings, this.service);
  }

  ngOnInit(): void {
    this.table.events.onLoading(true);
    fetch('assets/players.json').then(res => res.json()).then(data => {
      for (const row of data) {
        row.$$height = (row.exp > 1000000) ? 40 : 25;
      }
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

}
