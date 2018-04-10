import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataSource, DataManager} from '../../ng-crud-table';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-global-filter-demo',
  template: `<app-crud-table [dataManager]="dataManager"></app-crud-table>`
})

export class GlobalFilterDemoComponent implements OnInit {

  public service: DataSource;
  public columns: Column[];
  public dataManager: DataManager;

  public settings: Settings = {
    api: 'assets/players.json',
    crud: false,
    primaryKeys: ['id'],
    bodyHeight: 380,
    globalFilter: true
  };

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    for (const column of this.columns) {
      column.editable = false;
    }
    this.service = new DemoService(this.http);
    this.dataManager = new DataManager(this.columns, this.settings, this.service);
  }

  ngOnInit() {
  }

}
