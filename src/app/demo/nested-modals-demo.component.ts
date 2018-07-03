import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataSource, DataManager} from '../../ng-crud-table';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-nested-modals-demo',
  template: `
    <app-modal #modal [modalTitle]="'Data-table'" [maximizable]="true" [width]="1100">
      <ng-container class="app-modal-body">
        <app-crud-table
          [dataManager]="dataManager"
          (select)="onSelect($event)">
        </app-crud-table>
      </ng-container>
    </app-modal>
    <button type="button"
            class="button"
            (click)="openModal()">open modal
    </button>
  `
})

export class NestedModalsDemoComponent implements OnInit {

  public service: DataSource;
  public columns: Column[];
  public dataManager: DataManager;

  public settings: Settings = <Settings>{
    api: 'assets/players.json',
    crud: true,
    primaryKeys: ['id'],
    bodyHeight: 380,
    zIndexModal: 1110
  };

  @ViewChild('modal') modal: any;

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

  openModal() {
    this.modal.show();
  }

  onSelect(event) {
    console.log(event);
  }

}
