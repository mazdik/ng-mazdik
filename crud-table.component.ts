import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {Http} from '@angular/http';
import {MainService} from './services/main.service';
import {ModalComponent} from './modal/modal.component';
import {Column, Filter, Settings, ICrudService, SortMeta, MenuItem} from './types/interfaces';


@Component({
  selector: 'crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.css'],
})

export class CrudTableComponent implements OnInit {

  @Input() public columns: Column[];
  @Input() public settings: Settings;
  @Output() filterChanged: EventEmitter<Filter> = new EventEmitter();

  @Input()
  set filters(val: any) {
    this._filters = val;
    this.filterChanged.emit(this._filters);
  }

  get filters(): any {
    return this._filters;
  }

  _filters: Filter = {};

  @ViewChild('childModal')
  public readonly childModal: ModalComponent;

  public items: any[];
  public item: any;
  public selectedItem: any;
  public selectedRowIndex: number;
  public newItem: boolean;
  public errors: any;
  public onDetailView: boolean = false;

  public loading: boolean = false;

  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public currentPage: number = 1;

  public sortMeta: SortMeta = <SortMeta>{};
  public service: ICrudService;
  public rowMenu: MenuItem[];

  constructor(private http: Http) {
  }

  ngOnInit() {
    this.service = MainService.getInstance(this.settings, this.http);
    this.initRowMenu();
    this.settings.initLoad = (this.settings.initLoad !== undefined) ? this.settings.initLoad : true;
    if (this.settings.initLoad) {
      this.getItems();
    }
  }

  initRowMenu() {
    this.rowMenu = [
      {
        label: 'View',
        icon: 'glyphicon glyphicon-eye-open',
        command: (event) => this.viewDetails(this.items[this.selectedRowIndex])
      },
      {
        label: 'Update',
        icon: 'glyphicon glyphicon-pencil',
        command: (event) => this.updateItem(this.items[this.selectedRowIndex]),
        disabled: !this.settings.crud
      }
    ];
  }

  loadingShow() {
    this.loading = true;
  }

  loadingHide() {
    this.loading = false;
  }

  getItems() {
    if (!this.service.url) {
      return {};
    }
    this.loadingShow();
    this.errors = null;
    this.service.getItems(this.currentPage, this.filters, this.sortMeta.field, this.sortMeta.order)
      .then(data => {
        this.loadingHide();
        this.items = data.items;
        this.totalItems = data._meta.totalCount;
        this.itemsPerPage = data._meta.perPage;
      })
      .catch(error => {
        this.loadingHide();
        this.errors = error;
      });
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    this.getItems();
  }

  save() {
    this.loadingShow();
    this.errors = null;
    if (this.newItem) {
      this.service
        .post(this.item)
        .then(res => {
          this.loadingHide();
          this.item = res;
          this.items.push(this.item);
        })
        .catch(error => {
          this.loadingHide();
          this.errors = error;
        });
    } else {
      this.service
        .put(this.item)
        .then(res => {
          this.loadingHide();
          this.items[this.findSelectedItemIndex()] = res;
        })
        .catch(error => {
          this.loadingHide();
          this.errors = error;
        });
    }
    this.childModal.hide();
  }

  delete() {
    this.loadingShow();
    this.errors = null;
    this.service
      .delete(this.item)
      .then(res => {
        this.loadingHide();
        this.items.splice(this.findSelectedItemIndex(), 1);
        this.item = null;
        this.onDetailView = false;
      })
      .catch(error => {
        this.loadingHide();
        this.errors = error;
      });
    this.childModal.hide();
  }

  cloneItem(item: any) {
    const clone = Object.assign({}, item);
    this.selectedItem = Object.assign({}, item);
    return clone;
  }

  findSelectedItemIndex(): number {
    const obj = this.items.find(x => JSON.stringify(x) === JSON.stringify(this.selectedItem));
    const index = this.items.indexOf(obj);
    return index;
  }

  createItem() {
    this.newItem = true;
    this.item = {};
    this.childModal.show();
  }

  updateItem(item: any) {
    this.newItem = false;
    this.item = this.cloneItem(item);
    this.childModal.show();
  }

  editItem(item: any) {
    this.newItem = false;
    this.item = this.cloneItem(item);
    this.save();
  }

  viewDetails(item: any) {
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

  modalTitle() {
    return (this.newItem) ? 'Create' : 'Update';
  }

  onSelectedRow(event) {
    this.selectedRowIndex = event;
  }

}
