import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-data-table';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-multiple-sort-demo',
  template: `
    <app-data-table [table]="table"></app-data-table>
  `
})

export class MultipleSortDemoComponent implements OnInit {

  table: DataTable;
  columns: Column[];

  settings: Settings = <Settings>{
    multipleSort: true,
  };

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    for (const column of this.columns) {
      column.editable = false;
    }

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
