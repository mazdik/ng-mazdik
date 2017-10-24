import {Component, OnInit, ViewChild} from '@angular/core';
import {Column, Settings} from '../index';
import {ITEMS} from './demo.items';
import {RANK} from './demo.rank';
import {INVENTORY} from './demo.inventory';

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
    <app-datatable
      #tableRank
      [columns]="columnsRank"
      [settings]="settingsRank"
      [rows]="rowsRank">
    </app-datatable>
    <app-datatable
      #tableInventory
      [columns]="columnsInventory"
      [settings]="settingsInventory"
      [rows]="rowsInventory">
    </app-datatable>
  `
})

export class MasterDetailDemoComponent implements OnInit {

  public rowsPlayers: any;
  public rowsRank: any;
  public rowsInventory: any;

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
    tableWidth: 820,
    scrollHeight: 250,
    clientSide: true,
  };

  public settingsInventory: Settings = {
    api: null,
    crud: false,
    primaryKey: 'id',
    tableWidth: 820,
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
    {title: 'Exp', name: 'exp' },
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
    {title: 'player_id', name: 'player_id'},
    {title: 'daily_ap', name: 'daily_ap'},
    {title: 'weekly_ap', name: 'weekly_ap'},
    {title: 'ap', name: 'ap'},
    {title: 'rank', name: 'rank'},
    {title: 'top_ranking', name: 'top_ranking'},
    {title: 'old_ranking', name: 'old_ranking'},
    {title: 'daily_kill', name: 'old_ranking'},
    {title: 'weekly_kill', name: 'weekly_kill'},
    {title: 'all_kill', name: 'all_kill'},
    {title: 'max_rank', name: 'max_rank'},
    {title: 'last_kill', name: 'last_kill'},
    {title: 'last_ap', name: 'last_ap'},
    {title: 'last_update', name: 'last_update'}
  ];

  public columnsInventory: Column[] = [
    {title: 'itemUniqueId', name: 'itemUniqueId'},
    {title: 'itemId', name: 'itemId'},
    {title: 'itemCount', name: 'itemCount'},
    {title: 'itemColor', name: 'itemColor'},
    {title: 'itemOwner', name: 'itemOwner'},
    {title: 'itemCreator', name: 'itemCreator'},
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

  constructor() {
  }

  ngOnInit() {
    this.rowsPlayers = ITEMS;
    this.rowsRank = RANK;
    this.rowsInventory = INVENTORY;
  }

  masterChanged(event) {
    const masterId = this.tablePlayers.rows[this.tablePlayers.selectedRowIndex]['id'];
    this.rowsRank = RANK.filter((value: any) => {
      return value['player_id'] === masterId;
    });
    this.rowsInventory = INVENTORY.filter((value: any) => {
      return value['itemOwner'] === masterId;
    });
  }

}
