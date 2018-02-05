import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, ICrudService, DataManager} from '../../ng-crud-table';
import {DemoService} from './demo.service';
import {ModalEditFormComponent} from '../../ng-crud-table/modal-edit-form/modal-edit-form.component';

@Component({
  selector: 'app-modal-form-demo',
  template: `
    <app-modal-edit-form #modalEditForm
                         [dataManager]="dataManager"
                         (saved)="onSaved($event)"
                         (updated)="onUpdated($event)">
    </app-modal-edit-form>
    <button type="button"
            class="button"
            (click)="createItem()">Create
    </button>
    <button type="button"
            class="button"
            (click)="updateItem()">Edit
    </button>
  `
})

export class ModalFormDemoComponent implements OnInit {

  public service: ICrudService;
  public dataManager: DataManager;

  public settings: Settings = {
    api: 'assets/players.json',
    crud: true,
    primaryKeys: ['id'],
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
      type: 'number',
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
      optionsUrl: 'assets/options.json',
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
    {
      title: 'Account name',
      name: 'account_name',
      editable: true,
      type: 'select-popup',
      optionsUrl: 'assets/accounts.json',
      keyColumn: 'account_id',
    },
    {
      title: 'Account id',
      name: 'account_id',
      formHidden: true,
      tableHidden: true,
    },
    {
      title: 'Player class',
      name: 'player_class',
      editable: true
    },
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

  _item: any = {
    'id': 96491,
    'name': 'Defunct',
    'account_id': 19,
    'account_name': 'berserk',
    'exp': 7734770,
    'recoverexp': 0,
    'x': 1024.99,
    'y': 2534.94,
    'z': 228.821,
    'heading': 17,
    'world_id': 220020000,
    'gender': 'MALE',
    'race': 'ASMODIANS',
    'player_class': 'CLERIC',
    'creation_date': '2013-04-14T14:49',
    'deletion_date': null,
    'last_online': '2013-04-14T22:51:14',
    'cube_size': 0,
    'advanced_stigma_slot_size': 0,
    'warehouse_size': 0,
    'mailboxLetters': 0,
    'mailboxUnReadLetters': 0,
    'brokerKinah': 0,
    'bind_point': 31,
    'title_id': -1,
    'online': 1
  };

  @ViewChild('modalEditForm') modalEditForm: ModalEditFormComponent;

  constructor(private http: HttpClient) {
    this.dataManager = new DataManager(this.columns, this.settings);
    this.service = new DemoService(this.http);
    this.dataManager.setService(this.service);
  }

  ngOnInit() {
    this.dataManager.item = Object.assign({}, this._item);
  }

  onSaved(event) {
    console.log(event);
  }

  onUpdated(event) {
    console.log(event);
  }

  createItem() {
    this.dataManager.clearItem();
    this.modalEditForm.open();
  }

  updateItem() {
    this.dataManager.item = Object.assign({}, this._item);
    this.modalEditForm.open();
  }

}
