import {Component, OnInit, ViewChild} from '@angular/core';
import {Column, Settings, DataTable} from '../../ng-crud-table';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-master-detail-demo',
  template: `
    <app-datatable
      #tablePlayers
      [table]="dtPlayers"
      [rows]="rowsPlayers"
      (filterChanged)="masterChanged($event)"
      (pageChanged)="masterChanged($event)"
      (sortChanged)="masterChanged($event)"
      (selectedRowIndexChanged)="masterChanged()">
    </app-datatable>
    <div style="display:inline-block; vertical-align: top;">
      <app-datatable
        [table]="dtInventory"
        [rows]="rowsInventory">
      </app-datatable>
    </div>
    <div style="display:inline-block; width: 5px;"></div>
    <div style="display:inline-block; vertical-align: top;">
      <app-datatable
        [table]="dtRank"
        [rows]="rowsRank">
      </app-datatable>
    </div>
  `
})

export class MasterDetailDemoComponent implements OnInit {

  public dtPlayers: DataTable;
  public dtInventory: DataTable;
  public dtRank: DataTable;
  public rowsPlayers: any = [];
  public rowsRank: any = [];
  public rowsInventory: any = [];

  @ViewChild('tablePlayers') tablePlayers: any;

  public settingsPlayers: Settings = {
    api: null,
    crud: true,
    primaryKeys: ['id'],
    tableWidth: 1100,
    scrollHeight: 250,
    clientSide: true,
  };

  public settingsRank: Settings = {
    api: null,
    crud: false,
    primaryKeys: ['id'],
    tableWidth: 500,
    scrollHeight: 250,
    clientSide: true,
  };

  public settingsInventory: Settings = {
    api: null,
    crud: false,
    primaryKeys: ['id'],
    tableWidth: 600,
    scrollHeight: 250,
    clientSide: true,
  };

  public columnsPlayers: Column[] = [
    {title: 'Id', name: 'id', type: 'number'},
    {title: 'Name', name: 'name'},
    {
      title: 'Race',
      name: 'race',
      type: 'select',
      options: [
        {id: 'ASMODIANS', name: 'ASMODIANS'},
        {id: 'ELYOS', name: 'ELYOS'},
      ],
    },
    {
      title: 'Cascading Select',
      name: 'note',
      type: 'select',
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

  private _rank: any = [];
  private _inventory: any = [];

  constructor(private http: HttpClient) {
    this.dtPlayers = new DataTable(this.columnsPlayers, this.settingsPlayers);
    this.dtInventory = new DataTable(this.columnsInventory, this.settingsInventory);
    this.dtRank = new DataTable(this.columnsRank, this.settingsRank);
  }

  ngOnInit() {
    this.http.get('assets/players.json').subscribe(data => {
      this.rowsPlayers = data;
      const masterId = this.rowsPlayers[0]['id'];
      this.tablePlayers.selectedRowIndex = 0;

      this.http.get('assets/rank.json').subscribe(rank => {
        this._rank = rank;
        this.rowsRank = this._rank.filter((value: any) => {
          return value['player_id'] === masterId;
        });
      });
      this.http.get('assets/inventory.json').subscribe(inventory => {
        this._inventory = inventory;
        this.rowsInventory = this._inventory.filter((value: any) => {
          return value['itemOwner'] === masterId;
        });
      });

    });
  }

  masterChanged() {
    if (this.tablePlayers.rows.length > 0 &&
      this.dtPlayers.selectedRowIndex !== undefined &&
      this.tablePlayers.rows[this.dtPlayers.selectedRowIndex]) {

      const masterId = this.tablePlayers.rows[this.dtPlayers.selectedRowIndex]['id'];
      this.rowsRank = this._rank.filter((value: any) => {
        return value['player_id'] === masterId;
      });
      this.rowsInventory = this._inventory.filter((value: any) => {
        return value['itemOwner'] === masterId;
      });
    } else {
      this.rowsRank = [];
      this.rowsInventory = [];
    }
  }

}
