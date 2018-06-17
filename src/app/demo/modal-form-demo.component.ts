import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataSource, DataManager} from '../../ng-crud-table';
import {DemoService} from './demo.service';
import {ModalEditFormComponent} from '../../ng-crud-table/components/modal-edit-form/modal-edit-form.component';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-modal-form-demo',
  template: `<p>Dependent drop down lists, lazy load, modal select list</p>
    <app-modal-edit-form #modalEditForm
                         [dataManager]="dataManager"
                         (saved)="onSaved($event)"
                         (updated)="onUpdated($event)">
    </app-modal-edit-form>
    <button type="button"
            class="button"
            (click)="createItem()">Create
    </button>&nbsp;
    <button type="button"
            class="button"
            (click)="updateItem()">Edit
    </button>
  `
})

export class ModalFormDemoComponent implements OnInit {

  public service: DataSource;
  public columns: Column[];
  public dataManager: DataManager;

  public settings: Settings = {
    api: 'assets/players.json',
    crud: true,
    primaryKeys: ['id'],
  };

  @ViewChild('modalEditForm') modalEditForm: ModalEditFormComponent;

  private _item: any = {
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

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    this.columns[3].options = null;
    this.columns[3].optionsUrl = 'assets/options.json';

    this.columns[7].type = 'select-popup';
    this.columns[7].optionsUrl = 'assets/accounts.json';
    this.columns[7].keyColumn = 'account_id';

    this.columns[9].formHidden = true;
    this.columns[9].tableHidden = true;

    this.service = new DemoService(this.http);
    this.dataManager = new DataManager(this.columns, this.settings, this.service);
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
