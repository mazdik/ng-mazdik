import {Component, OnInit} from '@angular/core';
import {Column, CdtSettings, DataManager, SelectItem, DtMessages, DtMessagesEn} from 'ng-mazdik-lib';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-basic-demo',
  template: `<app-crud-table [dataManager]="dataManager"></app-crud-table>`
})

export class BasicDemoComponent implements OnInit {

  columns: Column[];
  dataManager: DataManager;

  settings: CdtSettings = new CdtSettings({
    crud: true,
    bodyHeight: 380,
    exportAction: true,
    globalFilter: true,
    columnToggleAction: true,
    clearAllFiltersAction: true,
  });

  messages: DtMessages = new DtMessagesEn({
    titleDetailView: 'Player details',
    titleCreate: 'Create a new player'
  });

  constructor(private service: DemoService) {
    this.columns = getColumnsPlayers();
    this.columns.forEach((x, i) => (i > 0) ? x.editable = true : x.editable = false);
    this.columns[4].filterValues = this.filterValuesFunc;
    this.dataManager = new DataManager(this.columns, this.settings, this.service, this.messages);
    this.dataManager.pager.perPage = 20;
  }

  ngOnInit() {}

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
