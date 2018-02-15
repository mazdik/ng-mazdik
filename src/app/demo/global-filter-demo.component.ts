import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataSource} from '../../ng-crud-table';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-global-filter-demo',
  template: `
    <app-crud-table
      [columns]="columns"
      [settings]="settings"
      [service]="service">
    </app-crud-table>`
})

export class GlobalFilterDemoComponent implements OnInit {

  public service: DataSource;
  public columns: Column[];

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    for (const column of this.columns) {
      column.editable = false;
    }
    this.service = new DemoService(this.http);
  }

  public settings: Settings = {
    api: 'assets/players.json',
    crud: false,
    primaryKeys: ['id'],
    scrollHeight: 380,
    globalFilter: true
  };

  ngOnInit() {
  }

}
