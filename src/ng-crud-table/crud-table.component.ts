import {Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {DataSource, Filter} from './types';
import {ModalEditFormComponent} from './modal-edit-form/modal-edit-form.component';
import {Settings} from './models/settings';
import {ColumnBase} from './models/column-base';
import {DataManager} from './models/data-manager';

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./styles/index.css'],
  encapsulation: ViewEncapsulation.None,
})

export class CrudTableComponent implements OnInit {

  @Input() public service: DataSource;
  @Input() public zIndexModal: number;
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

  set filters(val: Filter) {
    this.dataManager.dataFilter.filters = val;
  }

  get filters(): Filter {
    return this.dataManager.dataFilter.filters;
  }

  constructor() {
    this.dataManager = new DataManager();
  }

  ngOnInit() {
    this.dataManager.setService(this.service);
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

  refresh() {
    this.dataManager.getItems().then();
  }

  clear() {
    this.dataManager.clear();
  }

  refreshSelectedRow() {
    this.dataManager.refreshSelectedRow();
  }

}
