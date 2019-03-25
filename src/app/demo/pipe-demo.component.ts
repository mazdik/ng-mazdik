import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../lib/ng-data-table';
import {getColumnsPlayers} from './columns';
import {DateFormatPipe} from '../pipes/date-format.pipe';

@Component({
  selector: 'app-pipe-demo',
  template: `<p>Date format pipe on column "Last online"</p>
  <app-data-table [table]="table"></app-data-table>`
})

export class PipeDemoComponent implements OnInit {

  table: DataTable;
  columns: Column[];
  settings: Settings = <Settings>{};

  constructor(private http: HttpClient, private dateFormatPipe: DateFormatPipe) {
    this.columns = getColumnsPlayers();
    this.columns.find(x => x.name === 'last_online').pipe = this.dateFormatPipe;
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
