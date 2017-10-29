import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {Column, Filter, Settings, ICrudService, SortMeta, MenuItem} from './types/interfaces';
import {ModalEditFormComponent} from './modal-edit-form/modal-edit-form.component';


@Component({
  selector: 'crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.css'],
})

export class CrudTableComponent implements OnInit {

  @Input() public columns: Column[];
  @Input() public settings: Settings;
  @Input() public service: ICrudService;
  @Output() filterChanged: EventEmitter<Filter> = new EventEmitter();
  @Output() dataChanged: EventEmitter<any> = new EventEmitter();

  @Input()
  set filters(val: any) {
    this._filters = val;
    this.filterChanged.emit(this._filters);
  }

  get filters(): any {
    return this._filters;
  }

  _filters: Filter = {};

  public items: any[];
  public item: any;
  public selectedRowIndex: number;
  public errors: any;
  public onDetailView: boolean = false;

  public loading: boolean = false;

  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public currentPage: number = 1;

  public sortMeta: SortMeta = <SortMeta>{};
  public rowMenu: MenuItem[];
  public trackByProp: string;

  @ViewChild('modalEditForm') modalEditForm: ModalEditFormComponent;

  constructor() {
  }

  ngOnInit() {
    this.service.url = this.settings.api;
    this.service.primaryKey = this.settings.primaryKey;
    this.initRowMenu();
    this.settings.initLoad = (this.settings.initLoad !== undefined) ? this.settings.initLoad : true;
    if (this.settings.initLoad) {
      this.getItems();
    }
    if (!Array.isArray(this.settings.primaryKey)) {
      this.trackByProp = this.settings.primaryKey;
    }
  }

  initRowMenu() {
    this.rowMenu = [
      {
        label: 'View',
        icon: 'glyphicon glyphicon-eye-open',
        command: (event) => this.viewDetails()
      },
      {
        label: 'Update',
        icon: 'glyphicon glyphicon-pencil',
        command: (event) => this.updateItem(),
        disabled: !this.settings.crud
      }
    ];
  }

  getItems() {
    if (!this.service.url) {
      return;
    }
    this.loading = true;
    this.errors = null;
    this.onDetailView = false;
    this.service.getItems(this.currentPage, this.filters, this.sortMeta.field, this.sortMeta.order)
      .then(data => {
        this.loading = false;
        this.items = data.items;
        this.totalItems = data._meta.totalCount;
        this.itemsPerPage = data._meta.perPage;
      })
      .catch(error => {
        this.loading = false;
        this.errors = error;
      });
  }

  clear() {
    this.items = [];
    this.totalItems = 0;
    this.onDetailView = false;
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    this.getItems();
  }

  cloneItem(item: any) {
    const clone = Object.assign({}, item);
    return clone;
  }

  createItem() {
    this.item = {};
    this.modalEditForm.open();
  }

  updateItem() {
    const item = this.items[this.selectedRowIndex];
    this.item = this.cloneItem(item);
    this.modalEditForm.open();
  }

  onEditComplete(row: any) {
    this.loading = true;
    this.service
      .put(row)
      .then(res => {
        this.loading = false;
        this.errors = null;
      })
      .catch(error => {
        this.loading = false;
        this.errors = error;
      });
  }

  viewDetails() {
    const item = this.items[this.selectedRowIndex];
    this.errors = null;
    this.item = this.cloneItem(item);
    this.onDetailView = true;
  }

  closeDetails() {
    this.onDetailView = false;
  }

  onFilter(event) {
    this.filters = event;
    this.getItems();
  }

  sort(event) {
    this.sortMeta = event;
    this.getItems();
  }

  onSelectedRow(event) {
    this.selectedRowIndex = event;
  }

  onSaved(event) {
    this.items.push(event);
    this.dataChanged.emit(true);
  }

  onUpdated(event) {
    this.items[this.selectedRowIndex] = event;
    this.dataChanged.emit(true);
  }

  onDeleted(event) {
    if (event) {
      this.items.splice(this.selectedRowIndex, 1);
      this.dataChanged.emit(true);
    }
  }

  onLoading(event) {
    this.loading = event;
  }

  onErrors(event) {
    this.errors = event;
  }

}
