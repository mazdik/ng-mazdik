import {Component, ViewChild} from '@angular/core';
import {CdtSettings, DataManager, ModalEditFormComponent} from 'ng-mazdik-lib';
import {DemoService} from './demo.service';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-modal-edit-form-demo',
  template: `<p>Dependent drop down lists, lazy load, modal select list</p>
    <app-modal-edit-form #modalEditForm
                         [dataManager]="dataManager"
                         (saved)="onSaved($event)"
                         (updated)="onUpdated($event)">
    </app-modal-edit-form>
    <button class="dt-button" (click)="createItem()">Create</button>&nbsp;
    <button class="dt-button" (click)="updateItem()">Edit</button>&nbsp;
    <button class="dt-button" (click)="viewItem()">View</button>
  `
})

export class ModalEditFormDemoComponent {

  dataManager: DataManager;

  settings: CdtSettings = new CdtSettings({
    crud: true,
  });

  @ViewChild('modalEditForm', {static: false}) modalEditForm: ModalEditFormComponent;

  private item: any = {
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

  constructor(private service: DemoService) {
    const columns = getColumnsPlayers();
    this.dataManager = new DataManager(columns, this.settings, this.service);
  }

  onSaved(event) {
    console.log(event);
  }

  onUpdated(event) {
    console.log(event);
  }

  createItem() {
    this.dataManager.item = {};
    this.modalEditForm.isNewItem = true;
    this.modalEditForm.detailView = false;
    this.modalEditForm.open();
  }

  updateItem() {
    this.dataManager.item = this.item;
    this.modalEditForm.isNewItem = false;
    this.modalEditForm.detailView = false;
    this.modalEditForm.open();
  }

  viewItem() {
    this.dataManager.item = this.item;
    this.modalEditForm.isNewItem = false;
    this.modalEditForm.detailView = true;
    this.modalEditForm.open();
  }

}
