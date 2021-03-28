import { Component, OnInit } from '@angular/core';
import { Settings, DataTable } from 'ng-mazdik-lib';
import { getColumnsPlayers } from './columns';

@Component({
  selector: 'app-row-group-multiple-demo',
  template: `<app-data-table [table]="table"></app-data-table>`
})

export class RowGroupMultipleDemoComponent implements OnInit {

  table: DataTable;

  settings: Settings = new Settings({
    groupRowsBy: ['race', 'gender']
  });

  constructor() {
    const columns = getColumnsPlayers();
    columns.find(x => x.name === 'race').tableHidden = true;
    columns.find(x => x.name === 'gender').tableHidden = true;
    this.table = new DataTable(columns, this.settings);
    this.table.pager.perPage = 50;
  }

  ngOnInit(): void {
    this.table.events.onLoading(true);
    fetch('assets/players.json').then(res => res.json()).then(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

}
