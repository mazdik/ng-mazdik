import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Settings, DataTable} from 'ng-mazdik-lib';
import {getColumnsPlayers, getColumnsRank, getColumnsInventory} from './columns';

@Component({
  selector: 'app-modal-data-table-demo',
  template: `
    <app-data-table [table]="dtPlayers" style="width: 1100px;"></app-data-table>
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
    <app-modal class="rank-modal" #rankModal [maximizable]="true">
      <ng-container class="app-modal-header">Rank</ng-container>
      <ng-container class="app-modal-body" *ngIf="rankModal.visible">
        <app-data-table
          *ngIf="rankModal.visible"
          [table]="dtRank">
        </app-data-table>
      </ng-container>
    </app-modal>
    <app-modal class="inventory-modal" #inventoryModal [maximizable]="true">
      <ng-container class="app-modal-header">Inventory</ng-container>
      <ng-container class="app-modal-body">
        <app-data-table
          *ngIf="inventoryModal.visible"
          [table]="dtInventory">
        </app-data-table>
      </ng-container>
    </app-modal>
  `
})

export class ModalDataTableDemoComponent implements OnInit {

  dtPlayers: DataTable;
  dtInventory: DataTable;
  dtRank: DataTable;
  settings: Settings = new Settings({});

  @ViewChild('template1', {static: true}) template1: TemplateRef<any>;
  @ViewChild('template2', {static: true}) template2: TemplateRef<any>;
  @ViewChild('rankModal', {static: false}) rankModal: any;
  @ViewChild('inventoryModal', {static: false}) inventoryModal: any;

  private rank: any = [];
  private inventory: any = [];

  constructor(private http: HttpClient) {
    const columnsPlayers = getColumnsPlayers();
    columnsPlayers.splice(7);
    columnsPlayers[1].editable = false;
    const columnsRank = getColumnsRank();
    const columnsInventory = getColumnsInventory();

    this.dtPlayers = new DataTable(columnsPlayers, this.settings);
    this.dtInventory = new DataTable(columnsInventory, this.settings);
    this.dtRank = new DataTable(columnsRank, this.settings);
  }

  ngOnInit() {
    this.dtPlayers.columns[0].cellTemplate = this.template1;
    this.dtPlayers.columns[1].cellTemplate = this.template2;

    this.http.get<any[]>('assets/players.json').subscribe(data => {
      this.dtPlayers.rows = data;
    });
    this.http.get<any[]>('assets/rank.json').subscribe(rank => {
      this.rank = rank;
      this.dtRank.rows = rank;
    });
    this.http.get<any[]>('assets/inventory.json').subscribe(inventory => {
      this.inventory = inventory;
      this.dtInventory.rows = inventory;
    });
  }

  onClickCell1(event, value, row) {
    event.preventDefault();

    this.dtRank.rows = this.rank.filter((item: any) => {
      return item['player_id'] === value;
    });
    this.rankModal.show();
  }

  onClickCell2(event, value, row) {
    event.preventDefault();

    this.dtInventory.rows = this.inventory.filter((item: any) => {
      return item['itemOwner'] === row['id'];
    });
    this.inventoryModal.show();
  }

}
