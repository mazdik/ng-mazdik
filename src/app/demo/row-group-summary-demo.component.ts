import { Component, OnInit } from '@angular/core';
import { Settings, DataTable } from 'ng-mazdik-lib';
import { getColumnsPlayers } from './columns';

@Component({
  selector: 'app-row-group-summary-demo',
  template: `<app-data-table [table]="table"></app-data-table>`
})

export class RowGroupSummaryDemoComponent implements OnInit {

  table: DataTable;

  settings: Settings = new Settings({
    groupRowsBy: ['race', 'gender']
  });

  constructor() {
    const columns = getColumnsPlayers();
    columns.find(x => x.name === 'race').tableHidden = true;
    columns.find(x => x.name === 'gender').tableHidden = true;
    columns.splice(17);

    columns[1].title += ' (count)';
    columns[5].title += ' (sum)';
    columns[14].title += ' (min)';
    columns[15].title += ' (max)';
    columns[16].title += ' (average)';

    columns[1].aggregation = 'count';
    columns[5].aggregation = 'sum';
    columns[14].aggregation = 'min';
    columns[15].aggregation = 'max';
    columns[16].aggregation = 'average';

    columns.splice(6, 8);
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
