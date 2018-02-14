import {Component, OnInit} from '@angular/core';
import {Column, Settings, DataTable} from '../../ng-crud-table';
import {HttpClient} from '@angular/common/http';
import {getColumnsPlayers, getColumnsRank, getColumnsInventory} from './columns';

@Component({
  selector: 'app-master-detail-demo',
  template: `
    <app-datatable
      [table]="dtPlayers"
      (selectedRowIndexChanged)="masterChanged()">
    </app-datatable>
    <div style="display:inline-block; vertical-align: top;">
      <app-datatable [table]="dtInventory"></app-datatable>
    </div>
    <div style="display:inline-block; width: 5px;"></div>
    <div style="display:inline-block; vertical-align: top;">
      <app-datatable [table]="dtRank"></app-datatable>
    </div>
  `
})

export class MasterDetailDemoComponent implements OnInit {

  public dtPlayers: DataTable;
  public dtInventory: DataTable;
  public dtRank: DataTable;
  public columnsPlayers: Column[];
  public columnsRank: Column[];
  public columnsInventory: Column[];

  public settingsPlayers: Settings = {
    api: null,
    crud: true,
    primaryKeys: ['id'],
    scrollHeight: 250,
  };

  public settingsRank: Settings = {
    api: null,
    crud: false,
    primaryKeys: ['id'],
    tableWidth: 500,
    scrollHeight: 250,
  };

  public settingsInventory: Settings = {
    api: null,
    crud: false,
    primaryKeys: ['id'],
    tableWidth: 600,
    scrollHeight: 250,
  };

  private _rank: any = [];
  private _inventory: any = [];

  constructor(private http: HttpClient) {
    this.columnsPlayers = getColumnsPlayers();
    for (const column of this.columnsPlayers) {
      column.editable = false;
    }
    this.columnsRank = getColumnsRank();
    this.columnsInventory = getColumnsInventory();

    this.dtPlayers = new DataTable(this.columnsPlayers, this.settingsPlayers);
    this.dtInventory = new DataTable(this.columnsInventory, this.settingsInventory);
    this.dtRank = new DataTable(this.columnsRank, this.settingsRank);
  }

  ngOnInit() {
    this.http.get('assets/players.json').subscribe(data => {
      this.dtPlayers.rows = data;
      const masterId = this.dtPlayers.rows[0]['id'];
      this.dtPlayers.selectedRowIndex = 0;

      this.http.get('assets/rank.json').subscribe(rank => {
        this._rank = rank;
        this.dtRank.rows = this._rank.filter((value: any) => {
          return value['player_id'] === masterId;
        });
      });
      this.http.get('assets/inventory.json').subscribe(inventory => {
        this._inventory = inventory;
        this.dtInventory.rows = this._inventory.filter((value: any) => {
          return value['itemOwner'] === masterId;
        });
      });

    });
  }

  masterChanged() {
    if (this.dtPlayers.rows.length > 0 &&
      this.dtPlayers.selectedRowIndex !== undefined &&
      this.dtPlayers.rows[this.dtPlayers.selectedRowIndex]) {

      const masterId = this.dtPlayers.rows[this.dtPlayers.selectedRowIndex]['id'];
      this.dtRank.rows = this._rank.filter((value: any) => {
        return value['player_id'] === masterId;
      });
      this.dtInventory.rows = this._inventory.filter((value: any) => {
        return value['itemOwner'] === masterId;
      });
    } else {
      this.dtRank.rows = [];
      this.dtInventory.rows = [];
    }
  }

}
