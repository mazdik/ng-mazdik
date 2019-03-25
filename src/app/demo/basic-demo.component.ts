import {Component, OnInit} from '@angular/core';
import {Column, CdtSettings, DataManager} from '../../lib/ng-crud-table';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';
import {SelectItem} from '../../lib/common';
import {DtMessages} from '../../lib/dt-translate';

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
    columnToggleAction: true,
    clearAllFiltersAction: true,
  };

  messages: DtMessages = <DtMessages>{
    titleDetailView: 'Player details',
    titleCreate: 'Create a new player'
  };

  constructor(private service: DemoService) {
    this.columns = getColumnsPlayers();
    this.columns[4].filterValues = this.filterValuesFunc;
    this.dataManager = new DataManager(this.columns, this.settings, this.service, this.messages);
    this.dataManager.pager.perPage = 20;
  }

  ngOnInit() {
  }

  filterValuesFunc(columnName: string): Promise<SelectItem[]> {
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
