import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Settings, DataTable} from 'ng-mazdik-lib';
import {getColumnsPlayers} from './columns';
import {DateFormatPipe} from '../pipes/date-format.pipe';

@Component({
  selector: 'app-pipe-demo',
  template: `<p>Date format pipe on column "Last online"</p>
  <app-data-table [table]="table"></app-data-table>`
})

export class PipeDemoComponent implements OnInit {

  table: DataTable;
  settings: Settings = new Settings({});

  constructor(private http: HttpClient) {
    const columns = getColumnsPlayers();
    columns.find(x => x.name === 'last_online').pipe = new DateFormatPipe('en-US');
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
