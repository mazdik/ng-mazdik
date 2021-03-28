import { Component, OnInit } from '@angular/core';
import { Settings, DataTable } from 'ng-mazdik-lib';
import { getColumnsPlayers } from './columns';

@Component({
  selector: 'app-multiple-sort-demo',
  template: `<app-data-table [table]="table"></app-data-table>`
})

export class MultipleSortDemoComponent implements OnInit {

  table: DataTable;

  settings: Settings = new Settings({
    multipleSort: true,
  });

  constructor() {
    const columns = getColumnsPlayers();
    this.table = new DataTable(columns, this.settings);
  }

  ngOnInit(): void {
    this.table.events.onLoading(true);
    fetch('assets/players.json').then(res => res.json()).then(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

}
