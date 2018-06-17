import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataSource, Message, DataManager} from '../../ng-crud-table';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-basic-demo',
  template: `<app-crud-table [dataManager]="dataManager"></app-crud-table>`
})

export class BasicDemoComponent implements OnInit {

  public service: DataSource;
  public columns: Column[];
  public dataManager: DataManager;

  public settings: Settings = {
    api: 'assets/players.json',
    crud: true,
    primaryKeys: ['id'],
    bodyHeight: 380,
    exportAction: true,
  };

  public messages: Message = {
    titleDetailView: 'Player details',
    titleCreate: 'Create a new player'
  };

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    this.service = new DemoService(this.http);
    this.dataManager = new DataManager(this.columns, this.settings, this.service, this.messages);
  }

  ngOnInit() {
  }

}
