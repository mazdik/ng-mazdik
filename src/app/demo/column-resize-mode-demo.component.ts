import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../lib/ng-data-table';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-column-resize-mode-demo',
  template: `<p>Column resize mode: simple (default)</p>
  <app-data-table [table]="table"></app-data-table>
  <p>Column resize mode: aminated</p>
  <app-data-table [table]="table2"></app-data-table>
  `
})

export class ColumnResizeModeDemoComponent implements OnInit {

  table: DataTable;
  columns: Column[];
  settings: Settings = <Settings>{};

  table2: DataTable;
  settings2: Settings = <Settings>{
    columnResizeMode: 'aminated',
  };

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    this.table = new DataTable(this.columns, this.settings);
    this.table2 = new DataTable(this.columns, this.settings2);
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table2.rows = data;
      this.table.events.onLoading(false);
    });
  }

}
