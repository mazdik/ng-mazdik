import {Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {Column, Filter, Settings, ICrudService, SortMeta, MenuItem} from './types/interfaces';
import {ModalEditFormComponent} from './modal-edit-form/modal-edit-form.component';


@Component({
  selector: 'crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['crud-table.css', 'icons.css'],
  encapsulation: ViewEncapsulation.None,
})

export class CrudTableComponent implements OnInit {

  @Input() public columns: Column[];
  @Input() public settings: Settings;
  @Input() public service: ICrudService;
  @Input() public zIndexModal: number;
  @Output() filterChanged: EventEmitter<Filter> = new EventEmitter();
  @Output() dataChanged: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<any> = new EventEmitter();

  @Input()
  set filters(val: any) {
    this._filters = val;
    this.filterChanged.emit(this._filters);
  }

  get filters(): any {
    return this._filters;
  }

  private _filters: Filter = {};

  public items: any[];
  public item: any;
  public selectedRowIndex: number;
  public errors: any;
  public detailView: boolean = false;
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
        icon: 'icon icon-rightwards',
        command: (event) => this.viewDetails()
      },
      {
        label: 'Update',
        icon: 'icon icon-pencil',
        command: (event) => this.updateItem(),
        disabled: !this.settings.crud
      }
    ];
  }

  getItems(): Promise<any> | any {
    if (!this.service.url) {
      return;
    }
    this.loading = true;
    this.errors = null;
    return this.service.getItems(this.currentPage, this.filters, this.sortMeta.field, this.sortMeta.order)
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
    this.detailView = false;
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
    this.detailView = false;
    this.modalEditForm.open();
  }

  updateItem() {
    const item = this.items[this.selectedRowIndex];
    this.item = this.cloneItem(item);
    this.detailView = false;
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
    this.detailView = true;
    this.modalEditForm.open();
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
    this.select.emit(this.items[this.selectedRowIndex]);
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
