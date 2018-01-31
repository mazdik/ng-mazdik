import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-crud-table';


@Component({
  selector: 'app-modal-data-table-demo',
  template: `
    <app-datatable
      [table]="dtPlayers"
      [rows]="rows"
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
          [rows]="rowsRank"
          [loading]="loading">
        </app-datatable>
      </ng-container>
    </app-modal>
    <app-modal #inventoryModal [modalTitle]="'Inventory'">
      <ng-container class="app-modal-body">
        <app-datatable
          *ngIf="inventoryModal.visible"
          [table]="dtInventory"
          [rows]="rowsInventory">
        </app-datatable>
      </ng-container>
    </app-modal>
  `
})

export class ModalDataTableDemoComponent implements OnInit {

  public dtPlayers: DataTable;
  public dtInventory: DataTable;
  public dtRank: DataTable;
  public rows: any = [];
  public loading: boolean = false;
  public rowsRank: any = [];
  public rowsInventory: any = [];

  @ViewChild('template1') template1: TemplateRef<any>;
  @ViewChild('template2') template2: TemplateRef<any>;
  @ViewChild('rankModal') rankModal: any;
  @ViewChild('inventoryModal') inventoryModal: any;

  public settingsPlayers: Settings = {
    api: null,
    crud: true,
    primaryKeys: ['id'],
    tableWidth: 1100,
    clientSide: true,
  };

  public settingsRank: Settings = {
    api: null,
    crud: false,
    primaryKeys: ['id'],
    tableWidth: 900,
    scrollHeight: 250,
    clientSide: true,
  };

  public settingsInventory: Settings = {
    api: null,
    crud: false,
    primaryKeys: ['id'],
    tableWidth: 900,
    scrollHeight: 250,
    clientSide: true,
  };

  public columnsPlayers: Column[] = [
    {title: 'Id', name: 'id'},
    {title: 'Name', name: 'name'},
    {
      title: 'Race',
      name: 'race',
      sortable: true,
      filter: true,
      type: 'select',
      options: [
        {id: 'ASMODIANS', name: 'ASMODIANS'},
        {id: 'ELYOS', name: 'ELYOS'},
      ],
      editable: true,
    },
    {
      title: 'Cascading Select',
      name: 'note',
      editable: true,
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
      sortable: true,
      filter: true,
      type: 'radio',
      options: [
        {id: 'MALE', name: 'MALE'},
        {id: 'FEMALE', name: 'FEMALE'},
      ],
      editable: true,
    },
    {
      title: 'Exp',
      name: 'exp',
      sortable: true,
      filter: true,
      type: 'number',
      validation: {required: true, minLength: 2, maxLength: 10},
      editable: true,
    },
    {
      title: 'Last online',
      name: 'last_online',
      sortable: true,
      filter: true,
      type: 'datetime-local',
      editable: true,
    }
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
    this.dtPlayers.columns[0]['cellTemplate'] = this.template1;
    this.dtPlayers.columns[1]['cellTemplate'] = this.template2;

    this.loading = true;
    this.http.get('assets/players.json').subscribe(data => {
      this.rows = data;
      this.loading = false;
    });
    this.http.get('assets/rank.json').subscribe(rank => {
      this._rank = rank;
      this.rowsRank = rank;
    });
    this.http.get('assets/inventory.json').subscribe(inventory => {
      this._inventory = inventory;
      this.rowsInventory = inventory;
    });
  }

  onClickCell1(event, value, row) {
    event.preventDefault();

    this.rowsRank = this._rank.filter((item: any) => {
      return item['player_id'] === value;
    });
    this.rankModal.show();
  }

  onClickCell2(event, value, row) {
    event.preventDefault();

    this.rowsInventory = this._inventory.filter((item: any) => {
      return item['itemOwner'] === row['id'];
    });
    this.inventoryModal.show();
  }

}
