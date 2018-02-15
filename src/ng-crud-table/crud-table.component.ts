import {Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation, OnDestroy} from '@angular/core';
import {DataSource, Filter} from './types';
import {ModalEditFormComponent} from './modal-edit-form/modal-edit-form.component';
import {Settings} from './base/settings';
import {ColumnBase} from './base/column-base';
import {DataManager} from './base/data-manager';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./styles/index.css'],
  encapsulation: ViewEncapsulation.None,
})

export class CrudTableComponent implements OnInit, OnDestroy {

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
    this.dataManager.settings.clientSide = false;
  }

  get settings(): Settings {
    return this._settings;
  }

  public dataManager: DataManager;

  private _columns: ColumnBase[];
  private _settings: Settings;
  private subscriptions: Subscription[] = [];

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

    const subSelection = this.dataManager.dataService.selectionSource$.subscribe(() => {
      this.onSelectedRow();
    });
    const subFilter = this.dataManager.dataService.filterSource$.subscribe(() => {
      this.onFilter();
    });
    const subSort = this.dataManager.dataService.sortSource$.subscribe(() => {
      this.onSort();
    });
    const subPage = this.dataManager.dataService.pageSource$.subscribe(() => {
      this.onPageChanged();
    });
    const editPage = this.dataManager.dataService.editSource$.subscribe((row) => {
      this.onEditComplete(row);
    });
    const rowMenu = this.dataManager.dataService.rowMenuSource$.subscribe((data) => {
      this.onRowMenu(data);
    });
    this.subscriptions.push(subSelection);
    this.subscriptions.push(subFilter);
    this.subscriptions.push(subSort);
    this.subscriptions.push(subPage);
    this.subscriptions.push(editPage);
    this.subscriptions.push(rowMenu);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  initRowMenu() {
    this.dataManager.actionMenu = [
      {
        label: this.dataManager.settings.messages.titleDetailView,
        icon: 'icon icon-rightwards',
        command: 'view'
      },
      {
        label: this.dataManager.settings.messages.titleUpdate,
        icon: 'icon icon-pencil',
        command: 'update',
        disabled: !this.settings.crud
      }
    ];
  }

  onRowMenu(data: any) {
    if (data.menuItem.command === 'view') {
      this.viewAction();
    } else if (data.menuItem.command === 'update') {
      this.updateAction();
    }
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
    this.dataManager.dataFilter.globalFilterValue = null;
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

  onClickGlobalSearch() {
    this.dataManager.dataFilter.isGlobal = true;
    this.dataManager.dataFilter.clear();
    this.dataManager.getItems().then();
  }

  onKeyPressGlobalSearch(event: KeyboardEvent) {
    if (event.which === 13) {
      this.dataManager.dataFilter.isGlobal = true;
      this.dataManager.dataFilter.clear();
      this.dataManager.getItems().then();
    }
  }

}
