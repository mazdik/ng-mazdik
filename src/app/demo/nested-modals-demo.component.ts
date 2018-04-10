import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataSource} from '../../ng-crud-table';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-nested-modals-demo',
  template: `
    <app-modal #modal [modalTitle]="'Data-table'">
      <ng-container class="app-modal-body">
        <app-crud-table
          [columns]="columns"
          [settings]="settings"
          [service]="service"
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

  public settings: Settings = {
    api: 'assets/players.json',
    crud: true,
    primaryKeys: ['id'],
    tableWidth: 1100,
    bodyHeight: 380,
    zIndexModal: 1110
  };

  public columns: Column[];
  @ViewChild('modal') modal: any;

  public service: DataSource;

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    this.columns.splice(7);
    for (const column of this.columns) {
      column.editable = false;
    }
    this.service = new DemoService(this.http);
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
