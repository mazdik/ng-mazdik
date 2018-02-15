import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataSource} from '../../ng-crud-table';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-basic-demo',
  template: `
    <app-crud-table
      [columns]="columns"
      [settings]="settings"
      [service]="service">
    </app-crud-table>`
})

export class BasicDemoComponent implements OnInit {

  public service: DataSource;
  public columns: Column[];

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    this.service = new DemoService(this.http);
  }

  public settings: Settings = {
    api: 'assets/players.json',
    crud: true,
    primaryKeys: ['id'],
    scrollHeight: 380,
    messages: {
      titleDetailView: 'Player details',
      titleCreate: 'Create a new player'
    },
    globalFilter: true
  };

  ngOnInit() {
    this.columns[5].cellClass = this.getCellClass;
  }

  getCellClass({row, column, value}): any {
    return {
      'cell-big-value': parseInt(value, 10) > 1000000000,
      'cell-middle-value': parseInt(value, 10) > 1000000 && parseInt(value, 10) < 1000000000,
      'cell-zero-value': parseInt(value, 10) === 0,
    };
  }

}
