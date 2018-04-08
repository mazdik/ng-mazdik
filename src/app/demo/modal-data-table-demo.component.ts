import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-crud-table';
import {getColumnsPlayers, getColumnsRank, getColumnsInventory} from './columns';

@Component({
  selector: 'app-modal-data-table-demo',
  template: `
    <app-datatable
      [table]="dtPlayers"
      [loading]="loading">
    </app-datatable>
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
    <app-modal #rankModal [modalTitle]="'Rank'">
      <ng-container class="app-modal-body" *ngIf="rankModal.visible">
        <app-datatable
          *ngIf="rankModal.visible"
          [table]="dtRank"
          [loading]="loading">
        </app-datatable>
      </ng-container>
    </app-modal>
    <app-modal #inventoryModal [modalTitle]="'Inventory'">
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

  public dtPlayers: DataTable;
  public dtInventory: DataTable;
  public dtRank: DataTable;
  public columnsPlayers: Column[];
  public columnsRank: Column[];
  public columnsInventory: Column[];
  public loading: boolean;

  @ViewChild('template1') template1: TemplateRef<any>;
  @ViewChild('template2') template2: TemplateRef<any>;
  @ViewChild('rankModal') rankModal: any;
  @ViewChild('inventoryModal') inventoryModal: any;

  public settingsPlayers: Settings = {
    tableWidth: 1100,
  };

  public settingsRank: Settings = {
    tableWidth: 900,
    bodyHeight: 250,
  };

  public settingsInventory: Settings = {
    tableWidth: 900,
    bodyHeight: 250,
  };

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

    this.loading = true;
    this.http.get('assets/players.json').subscribe(data => {
      this.dtPlayers.rows = data;
      this.loading = false;
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
