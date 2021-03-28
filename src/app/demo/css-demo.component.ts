import { Component, OnInit } from '@angular/core';
import { Settings, DataTable } from 'ng-mazdik-lib';
import { getColumnsPlayers } from './columns';

@Component({
  selector: 'app-css-demo',
  template: `<app-data-table [table]="table"></app-data-table>`
})

export class CssDemoComponent implements OnInit {

  table: DataTable;
  settings: Settings = new Settings({});

  constructor() {
    const columns = getColumnsPlayers();
    columns[5].cellClass = this.getCellClass;
    this.settings.rowClass = this.getRowClass;
    columns[2].headerCellClass = 'header-cell-demo';
    this.table = new DataTable(columns, this.settings);
    this.table.pager.perPage = 20;
  }

  ngOnInit(): void {
    this.table.events.onLoading(true);
    fetch('assets/players.json').then(res => res.json()).then(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

  getCellClass({ row, column, value }): any {
    return {
      'cell-big-value': parseInt(value, 10) > 1000000000,
      'cell-middle-value': parseInt(value, 10) > 1000000 && parseInt(value, 10) < 1000000000,
      'cell-zero-value': parseInt(value, 10) === 0,
      'cell-right': true,
    };
  }

  getRowClass(row): any {
    return {
      'row-warrior': (row['player_class'] === 'WARRIOR'),
      'row-sorcerer': (row['player_class'] === 'SORCERER')
    };
  }

}
