import {Component, OnInit} from '@angular/core';
import {Column, CdtSettings, Message, DataManager} from '../../ng-crud-table';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';
import {SelectOption} from '../../ng-data-table';

@Component({
  selector: 'app-basic-demo',
  template: `<app-crud-table [dataManager]="dataManager"></app-crud-table>`
})

export class BasicDemoComponent implements OnInit {

  columns: Column[];
  dataManager: DataManager;

  settings: CdtSettings = <CdtSettings>{
    crud: true,
    bodyHeight: 380,
    exportAction: true,
    globalFilter: true,
  };

  messages: Message = <Message>{
    titleDetailView: 'Player details',
    titleCreate: 'Create a new player'
  };

  constructor(private service: DemoService) {
    this.columns = getColumnsPlayers();
    this.columns[4].filterValuesFunc = this.filterValuesFunc;
    this.dataManager = new DataManager(this.columns, this.settings, this.service, this.messages);
    this.dataManager.pager.perPage = 20;
  }

  ngOnInit() {
  }

  filterValuesFunc(columnName: string): Promise<SelectOption[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(
        [
          {id: 'MALE', name: 'MALE'},
          {id: 'FEMALE', name: 'FEMALE'},
        ]
      ), 1000);
    });
  }

}
