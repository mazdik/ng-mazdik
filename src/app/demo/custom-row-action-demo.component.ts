import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {Column, CdtSettings, DataManager, CrudTableComponent} from '../../lib/ng-crud-table';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-custom-row-action-demo',
  template: `<app-crud-table #cdt [dataManager]="dataManager"></app-crud-table>`
})

export class CustomRowActionDemoComponent implements AfterViewInit {

  columns: Column[];
  dataManager: DataManager;
  settings: CdtSettings = new CdtSettings({
    crud: true
  });
  @ViewChild('cdt', {static: false}) cdt: CrudTableComponent;

  constructor(private service: DemoService) {
    this.columns = getColumnsPlayers();
    this.dataManager = new DataManager(this.columns, this.settings, this.service);
  }

  ngAfterViewInit() {
    const menuIndex = this.cdt.actionMenu.findIndex(x => x.id === this.dataManager.messages.delete);
    const oldBeforeOpen = this.cdt.rowMenuBeforeOpen;
    // disable menu based on data
    this.cdt.rowMenuBeforeOpen = (row) => {
      oldBeforeOpen.bind(this.cdt, row)(); // extend a function
      this.cdt.actionMenu[menuIndex].disabled = (row['race'] !== 'ASMODIANS');
    };
    // custom delete action
    this.cdt.actionMenu[menuIndex].command = (row) => {
      if (row['race'] === 'ASMODIANS') {
        return confirm('Delete row ?') ? this.dataManager.delete(row) : null;
      }
    };
    this.cdt.actionMenu[menuIndex].label = 'custom delete action';
    // add new menu
    this.cdt.actionMenu.push({
      id: 'test',
      label: 'new menu',
      command: (row) => alert(row['race']),
    });
  }
}
