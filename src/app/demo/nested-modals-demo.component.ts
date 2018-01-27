import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, ICrudService} from '../../ng-crud-table';
import {DemoService} from './demo.service';

@Component({
  selector: 'nested-modals-demo',
  template: `
    <app-modal #modal [modalTitle]="'Data-table'">
      <ng-container class="app-modal-body">
        <crud-table
          [columns]="columns"
          [settings]="settings"
          [service]="service"
          [zIndexModal]="1110"
          (select)="onSelect($event)">
        </crud-table>
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
    scrollHeight: 380,
  };

  public columns: Column[] = [
    {
      title: 'Id',
      name: 'id',
      sortable: true,
      filter: true,
      frozen: true,
      width: 100,
      formHidden: true,
    },
    {
      title: 'Name',
      name: 'name',
      sortable: true,
      filter: true,
      frozen: true,
      width: 200,
      validation: {required: true, pattern: '^[a-zA-Z ]+$'},
      editable: true,
    },
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
    },
    {title: 'Account name', name: 'account_name', editable: true, },
    {title: 'Account id', name: 'account_id', editable: true, },
    {title: 'Player class', name: 'player_class', editable: true, },
    {
      title: 'Online',
      name: 'online',
      editable: true,
      type: 'checkbox',
      options: [
        {id: 1, name: 'Online'}
      ]
    }
  ];
  @ViewChild('modal') modal: any;

  public service: ICrudService;

  constructor(private http: HttpClient) {
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
