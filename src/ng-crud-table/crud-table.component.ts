import {Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {Settings, ICrudService} from './types';
import {ModalEditFormComponent} from './modal-edit-form/modal-edit-form.component';
import {DataTable} from './models/data-table';
import {ColumnBase} from './models/column-base';
import {CrudTable} from './models/crud-table';

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
  @Input() public refreshRowOnSave: boolean;
  @Output() filterChanged: EventEmitter<any> = new EventEmitter();
  @Output() dataChanged: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<any> = new EventEmitter();

  @Input()
  set columns(val: ColumnBase[]) {
    this._columns = val;
    this.table.createColumns(this._columns);
  }

  get columns(): ColumnBase[] {
    return this._columns;
  }

  @Input()
  set settings(val: Settings) {
    this._settings = val;
    this.table.setSettings(this._settings);
  }

  get settings(): Settings {
    return this._settings;
  }

  public table: DataTable;
  public crudTable: CrudTable;
  public selectedRowIndex: number;
  public detailView: boolean = false;

  private _columns: ColumnBase[];
  private _settings: Settings;

  @ViewChild('modalEditForm') modalEditForm: ModalEditFormComponent;

  constructor() {
    this.table = new DataTable();
  }

  ngOnInit() {
    this.crudTable = new CrudTable(this.table, this.service);
    if (!this.trackByProp && this.settings.primaryKeys && this.settings.primaryKeys.length === 1) {
      this.trackByProp = this.settings.primaryKeys[0];
    }
    this.refreshRowOnSave = this.columns.some(x => x.keyColumn !== undefined);
    this.initRowMenu();
    if (this.table.settings.initLoad) {
      this.crudTable.getItems().then();
    }
  }

  initRowMenu() {
    this.table.actionMenu = [
      {
        label: this.table.settings.messages.titleDetailView,
        icon: 'icon icon-rightwards',
        command: (event) => this.viewDetails()
      },
      {
        label: this.table.settings.messages.titleUpdate,
        icon: 'icon icon-pencil',
        command: (event) => this.updateItem(),
        disabled: !this.settings.crud
      }
    ];
  }

  clear() {
    this.crudTable.items = [];
    this.table.pager.total = 0;
    this.detailView = false;
  }

  createItem() {
    this.crudTable.item = {};
    this.crudTable.isNewItem = true;
    this.detailView = false;
    this.modalEditForm.open();
  }

  updateItem() {
    const item = this.crudTable.items[this.selectedRowIndex];
    this.crudTable.item = Object.assign({}, item);
    this.crudTable.isNewItem = false;
    this.detailView = false;
    this.modalEditForm.open();
  }

  onEditComplete(row: any) {
    this.crudTable.loading = true;
    this.service
      .put(row)
      .then(res => {
        this.crudTable.loading = false;
        this.crudTable.errors = null;
      })
      .catch(error => {
        this.crudTable.loading = false;
        this.crudTable.errors = error;
      });
  }

  viewDetails() {
    const item = this.crudTable.items[this.selectedRowIndex];
    this.crudTable.errors = null;
    this.crudTable.item = Object.assign({}, item);
    this.detailView = true;
    this.modalEditForm.open();
  }

  onFilter() {
    this.crudTable.getItems().then();
  }

  onPageChanged() {
    this.crudTable.getItems().then();
  }

  onSort() {
    this.crudTable.getItems().then();
  }

  onSelectedRow(event) {
    this.selectedRowIndex = event;
    this.select.emit(this.crudTable.items[this.selectedRowIndex]);
  }

  onSaved(event) {
    if (this.refreshRowOnSave) {
      this.refreshRow(event, true);
    } else {
      this.crudTable.items.push(event);
    }
    this.dataChanged.emit(true);
  }

  onUpdated(event: any) {
    if (this.refreshRowOnSave) {
      this.refreshSelectedRow();
    } else {
      Object.keys(event).forEach(function (k) {
        if (k in this.crudTable.items[this.selectedRowIndex]) {
          this.crudTable.items[this.selectedRowIndex][k] = event[k];
        }
      }.bind(this));
    }
    this.dataChanged.emit(true);
  }

  onDeleted(event) {
    if (event) {
      this.crudTable.items.splice(this.selectedRowIndex, 1);
      this.dataChanged.emit(true);
    }
  }

  refreshRow(row: any, isNew: boolean) {
    this.crudTable.loading = true;
    this.crudTable.errors = null;
    this.service.getItem(row)
      .then(data => {
        this.crudTable.loading = false;
        if (isNew) {
          this.crudTable.items.push(data);
        } else {
          this.crudTable.items[this.selectedRowIndex] = data;
        }
      })
      .catch(error => {
        this.crudTable.loading = false;
        this.crudTable.errors = error;
      });
  }

  refreshSelectedRow() {
    this.refreshRow(this.crudTable.items[this.selectedRowIndex], false);
  }

}
