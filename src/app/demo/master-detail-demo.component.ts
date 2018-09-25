import {Component, OnInit} from '@angular/core';
import {Column, Settings, DataTable} from '../../ng-data-table';
import {HttpClient} from '@angular/common/http';
import {getColumnsPlayers, getColumnsRank, getColumnsInventory} from './columns';

@Component({
  selector: 'app-master-detail-demo',
  template: `
    <app-data-table
      [table]="dtPlayers"
      (selectionChange)="masterChanged()">
    </app-data-table>
    <div style="display:flex;">
      <div style="width: 59%;">
        <app-data-table [table]="dtInventory"></app-data-table>
      </div>
      <div style="width: 1%;"></div>
      <div style="width: 40%;">
        <app-data-table [table]="dtRank"></app-data-table>
      </div>
    </div>
  `
})

export class MasterDetailDemoComponent implements OnInit {

  dtPlayers: DataTable;
  dtInventory: DataTable;
  dtRank: DataTable;
  columnsPlayers: Column[];
  columnsRank: Column[];
  columnsInventory: Column[];

  settingsPlayers: Settings = <Settings>{
    bodyHeight: 250,
  };

  settingsRank: Settings = <Settings>{
    bodyHeight: 250,
  };

  settingsInventory: Settings = <Settings>{
    bodyHeight: 250,
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
      this.dtPlayers.selectRow(0);

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
    const selection = this.dtPlayers.selection.getSelection();
    if (this.dtPlayers.rows.length > 0 && selection.length !== 0 && this.dtPlayers.rows[selection[0]]) {

      const masterId = this.dtPlayers.rows[selection[0]]['id'];
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
