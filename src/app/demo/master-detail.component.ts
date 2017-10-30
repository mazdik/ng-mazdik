import {Component, OnInit, ViewChild} from '@angular/core';
import {Column, Settings} from '../../ng-crud-table';
import {Http} from '@angular/http';


@Component({
  selector: 'master-detail-demo',
  template: `
    <app-datatable
      #tablePlayers
      [columns]="columnsPlayers"
      [settings]="settingsPlayers"
      [rows]="rowsPlayers"
      (filterChanged)="masterChanged($event)"
      (pageChanged)="masterChanged($event)"
      (sortChanged)="masterChanged($event)"
      (selectedRowIndexChanged)="masterChanged($event)">
    </app-datatable>
    <div style="display:inline-block; vertical-align: top;">
      <app-datatable
        [columns]="columnsInventory"
        [settings]="settingsInventory"
        [rows]="rowsInventory">
      </app-datatable>
    </div>
    <div style="display:inline-block; width: 5px;"></div>
    <div style="display:inline-block; vertical-align: top;">
      <app-datatable
        [columns]="columnsRank"
        [settings]="settingsRank"
        [rows]="rowsRank"
        [loading]="loading">
      </app-datatable>
    </div>
  `
})

export class MasterDetailDemoComponent implements OnInit {

  public rowsPlayers: any[] = [];
  public rowsRank: any[] = [];
  public rowsInventory: any[] = [];
  public loading: boolean = false;

  @ViewChild('tablePlayers') tablePlayers: any;

  public settingsPlayers: Settings = {
    api: null,
    crud: true,
    primaryKey: 'id',
    tableWidth: 1100,
    scrollHeight: 250,
    clientSide: true,
  };

  public settingsRank: Settings = {
    api: null,
    crud: false,
    primaryKey: 'id',
    tableWidth: 500,
    scrollHeight: 250,
    clientSide: true,
  };

  public settingsInventory: Settings = {
    api: null,
    crud: false,
    primaryKey: 'id',
    tableWidth: 600,
    scrollHeight: 250,
    clientSide: true,
  };

  public columnsPlayers: Column[] = [
    {title: 'Id', name: 'id'},
    {title: 'Name', name: 'name'},
    {
      title: 'Race',
      name: 'race',
      type: 'dropdown',
      options: [
        {id: 'ASMODIANS', name: 'ASMODIANS'},
        {id: 'ELYOS', name: 'ELYOS'},
      ],
    },
    {
      title: 'Cascading Select',
      name: 'note',
      type: 'dropdown',
      options: [
        {id: 'ASM1', name: 'ASM note 1', parentId: 'ASMODIANS'},
        {id: 'ASM2', name: 'ASM note 2', parentId: 'ASMODIANS'},
        {id: 'ASM3', name: 'ASM note 3', parentId: 'ASMODIANS'},
        {id: 'ASM4', name: 'ASM note 4', parentId: 'ASMODIANS'},
        {id: 'ELY1', name: 'ELY note 1', parentId: 'ELYOS'},
        {id: 'ELY2', name: 'ELY note 2', parentId: 'ELYOS'},
        {id: 'ELY3', name: 'ELY note 3', parentId: 'ELYOS'},
      ],
      dependsColumn: 'race',
    },
    {
      title: 'Gender',
      name: 'gender',
      type: 'radio',
      options: [
        {id: 'MALE', name: 'MALE'},
        {id: 'FEMALE', name: 'FEMALE'},
      ],
    },
    {title: 'Exp', name: 'exp'},
    {title: 'Last online', name: 'last_online'},
    {title: 'Account name', name: 'account_name'},
    {title: 'Account id', name: 'account_id'},
    {title: 'Player class', name: 'player_class'},
    {title: 'Online', name: 'online'},
    {title: 'Cube size', name: 'cube_size'},
    {title: 'Broker Kinah', name: 'brokerKinah'},
    {title: 'Bind point', name: 'bind_point'},
    {title: 'X', name: 'x'},
    {title: 'Y', name: 'y'},
    {title: 'Z', name: 'z'},
    {title: 'Recoverexp', name: 'recoverexp'},
    {title: 'Heading', name: 'heading'},
    {title: 'World id', name: 'world_id'},
    {title: 'Creation date', name: 'creation_date'},
    {title: 'Stigma slot size', name: 'advanced_stigma_slot_size'},
    {title: 'Warehouse size', name: 'warehouse_size'},
    {title: 'Mailbox Letters', name: 'mailboxLetters'},
    {title: 'Mailbox Un Read Letters', name: 'mailboxUnReadLetters'},
    {title: 'Title id', name: 'title_id'},
    {title: 'Repletion state', name: 'repletionstate'},
    {title: 'Rebirth id', name: 'rebirth_id'},
    {title: 'Member points', name: 'memberpoints'},
    {title: 'Marry player id', name: 'marry_player_id'},
    {title: 'Marry title', name: 'marrytitle'},
    {title: 'Bg points', name: 'bg_points'},
    {title: 'Personal rating', name: 'personal_rating'},
    {title: 'Arena points', name: 'arena_points'},
    {title: 'Partner id', name: 'partner_id'},
    {title: 'Deletion date', name: 'deletion_date'},
  ];

  public columnsRank: Column[] = [
    {title: 'player_id', name: 'player_id', width: 100},
    {title: 'daily_ap', name: 'daily_ap', width: 100},
    {title: 'weekly_ap', name: 'weekly_ap', width: 100},
    {title: 'ap', name: 'ap', width: 100},
    {title: 'rank', name: 'rank', width: 100},
    {title: 'top_ranking', name: 'top_ranking', width: 100},
    {title: 'old_ranking', name: 'old_ranking', width: 100},
    {title: 'daily_kill', name: 'old_ranking', width: 100},
    {title: 'weekly_kill', name: 'weekly_kill', width: 100},
    {title: 'all_kill', name: 'all_kill', width: 100},
    {title: 'max_rank', name: 'max_rank', width: 100},
    {title: 'last_kill', name: 'last_kill', width: 100},
    {title: 'last_ap', name: 'last_ap', width: 100},
    {title: 'last_update', name: 'last_update', width: 120}
  ];

  public columnsInventory: Column[] = [
    {title: 'itemUniqueId', name: 'itemUniqueId', width: 100},
    {title: 'itemId', name: 'itemId', width: 100},
    {title: 'itemCount', name: 'itemCount', width: 100},
    {title: 'itemColor', name: 'itemColor', width: 100},
    {title: 'itemOwner', name: 'itemOwner', width: 100},
    {title: 'itemCreator', name: 'itemCreator', width: 100},
    {title: 'itemCreationTime', name: 'itemCreationTime'},
    {title: 'itemExistTime', name: 'itemExistTime'},
    {title: 'itemTradeTime', name: 'itemTradeTime'},
    {title: 'isEquiped', name: 'isEquiped'},
    {title: 'isSoulBound', name: 'isSoulBound'},
    {title: 'slot', name: 'slot'},
    {title: 'itemLocation', name: 'itemLocation'},
    {title: 'enchant', name: 'enchant'},
    {title: 'itemSkin', name: 'itemSkin'},
    {title: 'fusionedItem', name: 'fusionedItem'},
    {title: 'optionalSocket', name: 'optionalSocket'},
    {title: 'optionalFusionSocket', name: 'optionalFusionSocket'},
    {title: 'charge', name: 'charge'},
    {title: 'sealStats', name: 'sealStats'},
    {title: 'sealEndTime', name: 'sealEndTime'}
  ];

  private _rank: any[] = [];
  private _inventory: any[] = [];

  constructor(private http: Http) {

  }

  ngOnInit() {
    this.http.get('/assets/players.json').subscribe(data => {
      this.rowsPlayers = data.json();
      const masterId = this.rowsPlayers[0]['id'];

      this.http.get('/assets/rank.json').subscribe(rank => {
        this._rank = rank.json();
        this.rowsRank = this._rank.filter((value: any) => {
          return value['player_id'] === masterId;
        });
      });
      this.http.get('/assets/inventory.json').subscribe(inventory => {
        this._inventory = inventory.json();
        this.rowsInventory = this._inventory.filter((value: any) => {
          return value['itemOwner'] === masterId;
        });
      });

    });
  }

  masterChanged(event) {
    if (this.tablePlayers.rows.length > 0) {
      const masterId = this.tablePlayers.rows[this.tablePlayers.selectedRowIndex]['id'];

      this.rowsRank = this._rank.filter((value: any) => {
        return value['player_id'] === masterId;
      });
      this.rowsInventory = this._inventory.filter((value: any) => {
        return value['itemOwner'] === masterId;
      });
    }

  }

}
