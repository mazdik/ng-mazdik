import {Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {Settings, ICrudService} from './types';
import {ModalEditFormComponent} from './modal-edit-form/modal-edit-form.component';
import {ColumnBase} from './models/column-base';
import {DataManager} from './models/data-manager';

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./styles/index.css'],
  encapsulation: ViewEncapsulation.None,
})

export class CrudTableComponent implements OnInit {

  @Input() public service: ICrudService;
  @Input() public zIndexModal: number;
  @Input() public trackByProp: string;
  @Output() select: EventEmitter<any> = new EventEmitter();

  @Input()
  set columns(val: ColumnBase[]) {
    this._columns = val;
    this.dataManager.createColumns(this._columns);
  }

  get columns(): ColumnBase[] {
    return this._columns;
  }

  @Input()
  set settings(val: Settings) {
    this._settings = val;
    this.dataManager.setSettings(this._settings);
  }

  get settings(): Settings {
    return this._settings;
  }

  public dataManager: DataManager;

  private _columns: ColumnBase[];
  private _settings: Settings;

  @ViewChild('modalEditForm') modalEditForm: ModalEditFormComponent;

  constructor() {
    this.dataManager = new DataManager();
  }

  ngOnInit() {
    this.dataManager.setService(this.service);
    if (!this.trackByProp && this.settings.primaryKeys && this.settings.primaryKeys.length === 1) {
      this.trackByProp = this.settings.primaryKeys[0];
    }
    this.initRowMenu();
    if (this.dataManager.settings.initLoad) {
      this.dataManager.getItems().then();
    }
  }

  initRowMenu() {
    this.dataManager.actionMenu = [
      {
        label: this.dataManager.settings.messages.titleDetailView,
        icon: 'icon icon-rightwards',
        command: (event) => this.viewAction()
      },
      {
        label: this.dataManager.settings.messages.titleUpdate,
        icon: 'icon icon-pencil',
        command: (event) => this.updateAction(),
        disabled: !this.settings.crud
      }
    ];
  }

  createAction() {
    this.dataManager.clearItem();
    this.dataManager.detailView = false;
    this.modalEditForm.open();
  }

  viewAction() {
    this.dataManager.errors = null;
    this.dataManager.setItem();
    this.dataManager.detailView = true;
    this.modalEditForm.open();
  }

  updateAction() {
    this.dataManager.setItem();
    this.dataManager.detailView = false;
    this.modalEditForm.open();
  }

  onEditComplete(row: any) {
    this.dataManager.update(row);
  }

  onFilter() {
    this.dataManager.getItems().then();
  }

  onPageChanged() {
    this.dataManager.getItems().then();
  }

  onSort() {
    this.dataManager.getItems().then();
  }

  onSelectedRow() {
    this.select.emit(this.dataManager.getSelectedRow());
  }

}
