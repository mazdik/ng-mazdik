import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-data-table';
import {getColumnsPlayers, getColumnsRank, getColumnsInventory} from './columns';

@Component({
  selector: 'app-modal-data-table-demo',
  template: `
    <app-datatable [table]="dtPlayers"></app-datatable>
    <ng-template #template1 let-row="row" let-value="value">
      <a (click)="onClickCell1($event, value, row)" href="#">
        {{value}}
      </a>
    </ng-template>
    <ng-template #template2 let-row="row" let-value="value">
      <a (click)="onClickCell2($event, value, row)" href="#">
        {{value}}
      </a>
    </ng-template>
    <app-modal #rankModal [modalTitle]="'Rank'" [maximizable]="true" [width]="900">
      <ng-container class="app-modal-body" *ngIf="rankModal.visible">
        <app-datatable
          *ngIf="rankModal.visible"
          [table]="dtRank">
        </app-datatable>
      </ng-container>
    </app-modal>
    <app-modal #inventoryModal [modalTitle]="'Inventory'" [maximizable]="true" [width]="900">
      <ng-container class="app-modal-body">
        <app-datatable
          *ngIf="inventoryModal.visible"
          [table]="dtInventory">
        </app-datatable>
      </ng-container>
    </app-modal>
  `
})

export class ModalDataTableDemoComponent implements OnInit {

  dtPlayers: DataTable;
  dtInventory: DataTable;
  dtRank: DataTable;
  columnsPlayers: Column[];
  columnsRank: Column[];
  columnsInventory: Column[];

  @ViewChild('template1') template1: TemplateRef<any>;
  @ViewChild('template2') template2: TemplateRef<any>;
  @ViewChild('rankModal') rankModal: any;
  @ViewChild('inventoryModal') inventoryModal: any;

  settingsPlayers: Settings = <Settings>{
    tableWidth: 1100,
  };

  settingsRank: Settings = <Settings>{};
  settingsInventory: Settings = <Settings>{};

  private _rank: any = [];
  private _inventory: any = [];

  constructor(private http: HttpClient) {
    this.columnsPlayers = getColumnsPlayers();
    this.columnsPlayers.splice(7);
    this.columnsPlayers[1].editable = false;
    this.columnsRank = getColumnsRank();
    this.columnsInventory = getColumnsInventory();

    this.dtPlayers = new DataTable(this.columnsPlayers, this.settingsPlayers);
    this.dtInventory = new DataTable(this.columnsInventory, this.settingsInventory);
    this.dtRank = new DataTable(this.columnsRank, this.settingsRank);
  }

  ngOnInit() {
    this.dtPlayers.columns[0].cellTemplate = this.template1;
    this.dtPlayers.columns[1].cellTemplate = this.template2;

    this.http.get('assets/players.json').subscribe(data => {
      this.dtPlayers.rows = data;
    });
    this.http.get('assets/rank.json').subscribe(rank => {
      this._rank = rank;
      this.dtRank.rows = rank;
    });
    this.http.get('assets/inventory.json').subscribe(inventory => {
      this._inventory = inventory;
      this.dtInventory.rows = inventory;
    });
  }

  onClickCell1(event, value, row) {
    event.preventDefault();

    this.dtRank.rows = this._rank.filter((item: any) => {
      return item['player_id'] === value;
    });
    this.rankModal.show();
  }

  onClickCell2(event, value, row) {
    event.preventDefault();

    this.dtInventory.rows = this._inventory.filter((item: any) => {
      return item['itemOwner'] === row['id'];
    });
    this.inventoryModal.show();
  }

}
