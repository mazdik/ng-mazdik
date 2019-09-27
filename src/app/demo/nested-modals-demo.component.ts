import {Component, ViewChild} from '@angular/core';
import {CdtSettings, DataManager} from 'ng-mazdik-lib';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-nested-modals-demo',
  template: `
    <app-modal #modal [modalTitle]="'Data-table'" [maximizable]="true" [width]="1100">
      <ng-container class="app-modal-body">
        <app-crud-table [dataManager]="dataManager"></app-crud-table>
      </ng-container>
    </app-modal>
    <button class="dt-button" (click)="openModal()">open modal</button>
  `
})

export class NestedModalsDemoComponent {

  dataManager: DataManager;

  settings: CdtSettings = new CdtSettings({
    crud: true,
    bodyHeight: 380,
    zIndexModal: 1110
  });

  @ViewChild('modal', {static: false}) modal: any;

  constructor(private service: DemoService) {
    const columns = getColumnsPlayers();
    this.dataManager = new DataManager(columns, this.settings, this.service);
  }

  openModal() {
    this.modal.show();
  }

}
