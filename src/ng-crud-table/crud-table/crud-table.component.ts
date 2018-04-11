import {Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation, OnDestroy} from '@angular/core';
import {Row} from '../types';
import {ModalEditFormComponent} from '../modal-edit-form/modal-edit-form.component';
import {DataManager} from '../base/data-manager';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['../styles/index.css'],
  encapsulation: ViewEncapsulation.None,
})

export class CrudTableComponent implements OnInit, OnDestroy {

  @Input() public dataManager: DataManager;
  @Output() select: EventEmitter<any> = new EventEmitter();
  @Output() rowsChanged: EventEmitter<boolean> = new EventEmitter();

  private subscriptions: Subscription[] = [];

  @ViewChild('modalEditForm') modalEditForm: ModalEditFormComponent;

  constructor() {
  }

  ngOnInit() {
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
    const subEdit = this.dataManager.dataService.editSource$.subscribe((row) => {
      this.onEditComplete(row);
    });
    const subRowMenu = this.dataManager.dataService.rowMenuSource$.subscribe((data) => {
      this.onRowMenu(data);
    });
    const subRows = this.dataManager.dataService.rowsChanged$.subscribe(() => {
      this.rowsChanged.emit(true);
    });
    this.subscriptions.push(subSelection);
    this.subscriptions.push(subFilter);
    this.subscriptions.push(subSort);
    this.subscriptions.push(subPage);
    this.subscriptions.push(subEdit);
    this.subscriptions.push(subRowMenu);
    this.subscriptions.push(subRows);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  initRowMenu() {
    this.dataManager.actionMenu = [
      {
        label: this.dataManager.messages.titleDetailView,
        icon: 'icon icon-rightwards',
        command: 'view',
        disabled: !this.dataManager.settings.singleRowView
      },
      {
        label: this.dataManager.messages.titleUpdate,
        icon: 'icon icon-pencil',
        command: 'update',
        disabled: !this.dataManager.settings.crud
      }
    ];
  }

  onRowMenu(data: any) {
    if (data.menuItem.command === 'view') {
      this.viewAction(data.row);
    } else if (data.menuItem.command === 'update') {
      this.updateAction(data.row);
    }
  }

  createAction() {
    this.dataManager.clearItem();
    this.dataManager.detailView = false;
    this.modalEditForm.open();
  }

  viewAction(row: Row) {
    this.dataManager.errors = null;
    this.dataManager.setItem(row);
    this.dataManager.detailView = true;
    this.modalEditForm.open();
  }

  updateAction(row: Row) {
    this.dataManager.setItem(row);
    this.dataManager.detailView = false;
    this.modalEditForm.open();
  }

  onEditComplete(row: Row) {
    this.dataManager.update(row);
  }

  onPageChanged() {
    if (this.dataManager.settings.virtualScroll) {
      if (!this.dataManager.pager.isViewed()) {
        this.dataManager.getItems(true).then();
      }
    } else {
      this.dataManager.getItems().then();
    }
  }

  onFilter() {
    if (this.dataManager.settings.virtualScroll) {
      this.dataManager.resetPositionChunkRows();
      this.dataManager.pager.current = 1;
      this.dataManager.pager.cache = {};
    }
    this.dataManager.getItems().then();
  }

  onSort() {
    if (this.dataManager.settings.virtualScroll) {
      this.dataManager.resetPositionChunkRows();
      this.dataManager.pager.current = 1;
      this.dataManager.pager.cache = {};
    }
    this.dataManager.getItems().then();
  }

  onSelectedRow() {
    this.select.emit(this.dataManager.getSelectedRows());
  }

  globalFilter() {
    this.dataManager.dataFilter.filters = {};
    this.dataManager.dataFilter.isGlobal = true;
    this.dataManager.dataService.onFilter();
  }

  onClickGlobalSearch() {
    this.globalFilter();
  }

  onKeyPressGlobalSearch(event: KeyboardEvent) {
    if (event.which === 13) {
      this.globalFilter();
    }
  }

}
