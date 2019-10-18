import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Settings, DataTable} from 'ng-mazdik-lib';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-multiple-sort-demo',
  template: `<app-data-table [table]="table"></app-data-table>`
})

export class MultipleSortDemoComponent implements OnInit {

  table: DataTable;

  settings: Settings = new Settings({
    multipleSort: true,
  });

  constructor(private http: HttpClient) {
    const columns = getColumnsPlayers();
    this.table = new DataTable(columns, this.settings);
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get<any[]>('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

}
