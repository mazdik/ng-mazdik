import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy, TemplateRef,
  HostBinding, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {ModalEditFormComponent} from '../../../modal-edit-form/modal-edit-form.component';
import {DataManager} from '../../base/data-manager';
import {Subscription} from 'rxjs';
import {ContextMenuComponent} from '../../../context-menu/context-menu.component';
import {MenuEventArgs} from '../../../context-menu/types';
import {DataTableComponent} from '../../../ng-data-table/components/data-table/data-table.component';
import {Row} from '../../../ng-data-table/base/row';
import {EventHelper, ColumnModelGenerator} from '../../../ng-data-table/base';
import {MenuItem} from '../../../common';

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CrudTableComponent implements OnInit, OnDestroy {

  @Input() dataManager: DataManager;
  @Output() rowsChanged: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('modalEditForm', {static: false}) modalEditForm: ModalEditFormComponent;
  @ViewChild('rowMenu', {static: true}) rowMenu: ContextMenuComponent;
  @ViewChild(DataTableComponent, {static: true}) dt: DataTableComponent;
  @ViewChild('rowActionTemplate', {static: true}) rowActionTemplate: TemplateRef<any>;
  @ViewChild('headerActionTemplate', {static: true}) headerActionTemplate: TemplateRef<any>;

  @HostBinding('class.datatable') cssClass = true;

  actionMenu: MenuItem[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    const actionColumn = this.dataManager.columns.find(x => x.name === ColumnModelGenerator.actionColumn.name);
    if (actionColumn) {
      actionColumn.cellTemplate = this.rowActionTemplate;
      actionColumn.headerCellTemplate = this.headerActionTemplate;
    }
    this.initRowMenu();
    if (this.dataManager.settings.initLoad) {
      this.dataManager.loadItems().catch(() => this.cd.markForCheck());
    }
    const subFilter = this.dataManager.events.filterSource$.subscribe(() => {
      this.onFilter();
    });
    const subSort = this.dataManager.events.sortSource$.subscribe(() => {
      this.onSort();
    });
    const subPage = this.dataManager.events.pageSource$.subscribe(() => {
      this.onPageChanged();
    });
    const subRows = this.dataManager.events.rowsChanged$.subscribe(() => {
      this.rowsChanged.emit(true);
    });
    const subScroll = this.dataManager.events.scrollSource$.subscribe(() => {
      this.rowMenu.hide();
      requestAnimationFrame(() => this.cd.detectChanges());
    });
    this.subscriptions.push(subFilter);
    this.subscriptions.push(subSort);
    this.subscriptions.push(subPage);
    this.subscriptions.push(subRows);
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  initRowMenu() {
    if (this.dataManager.settings.singleRowView) {
      this.actionMenu.push(
        {
          id: this.dataManager.messages.titleDetailView,
          label: this.dataManager.messages.titleDetailView,
          icon: 'dt-icon dt-icon-rightwards',
          command: (row) => this.viewAction(row),
        }
      );
    }
    if (this.dataManager.settings.crud) {
      this.actionMenu.push(
        {
          id: this.dataManager.messages.titleUpdate,
          label: this.dataManager.messages.titleUpdate,
          icon: 'dt-icon dt-icon-pencil',
          command: (row) => this.updateAction(row),
        },
        {
          id: this.dataManager.messages.refresh,
          label: this.dataManager.messages.refresh,
          icon: 'dt-icon dt-icon-refresh',
          command: (row) => this.dataManager.refreshRow(row),
        },
        {
          id: this.dataManager.messages.revertChanges,
          label: this.dataManager.messages.revertChanges,
          icon: 'dt-icon dt-icon-return',
          command: (row) => this.dataManager.revertRowChanges(row),
          disabled: true,
        },
        {
          id: this.dataManager.messages.save,
          label: this.dataManager.messages.save,
          icon: 'dt-icon dt-icon-ok',
          command: (row) => this.dataManager.update(row),
          disabled: true,
        },
        {
          id: this.dataManager.messages.delete,
          label: this.dataManager.messages.delete,
          icon: 'dt-icon dt-icon-remove',
          command: (row) => confirm('Delete ?') ? this.dataManager.delete(row) : null,
        },
        {
          id: this.dataManager.messages.duplicate,
          label: this.dataManager.messages.duplicate,
          icon: 'dt-icon dt-icon-plus',
          command: (row) => this.duplicateAction(row),
        },
      );
    }
  }

  rowMenuBeforeOpen(row: Row) {
    const rowChanged = this.dataManager.rowChanged(row);
    let menuIndex = this.actionMenu.findIndex(x => x.id === this.dataManager.messages.revertChanges);
    if (menuIndex > -1) {
      this.actionMenu[menuIndex].disabled = !rowChanged;
    }
    menuIndex = this.actionMenu.findIndex(x => x.id === this.dataManager.messages.save);
    if (menuIndex > -1) {
      const rowIsValid = this.dataManager.rowIsValid(row);
      this.actionMenu[menuIndex].disabled = !rowChanged || !rowIsValid;
    }
  }

  onRowMenuClick(event: Event, row: Row) {
    const {left, top} = EventHelper.getRowPosition(event, this.dataManager.settings.virtualScroll);
    this.rowMenuBeforeOpen(row);
    this.rowMenu.show({originalEvent: event, data: row, left, top} as MenuEventArgs);
  }

  createAction() {
    this.dataManager.item = new Row({});
    this.modalEditForm.isNewItem = true;
    this.modalEditForm.detailView = false;
    this.modalEditForm.open();
  }

  viewAction(row: Row) {
    this.dataManager.item = row;
    this.modalEditForm.isNewItem = false;
    this.modalEditForm.detailView = true;
    this.modalEditForm.open();
  }

  updateAction(row: Row) {
    this.dataManager.item = row;
    this.modalEditForm.isNewItem = false;
    this.modalEditForm.detailView = false;
    this.modalEditForm.open();
  }

  duplicateAction(row: Row) {
    this.dataManager.item = row.clone();
    this.modalEditForm.isNewItem = true;
    this.modalEditForm.detailView = false;
    this.modalEditForm.open();
  }

  onPageChanged() {
    this.dataManager.loadItems();
  }

  onFilter() {
    this.dataManager.pager.current = 1;
    if (this.dataManager.settings.virtualScroll) {
      this.dt.body.scroller.setOffsetY(0);
      this.dataManager.pagerCache = {};
      this.dataManager.clear();
    }
    this.dataManager.loadItems();
  }

  onSort() {
    if (this.dataManager.settings.virtualScroll) {
      this.dt.body.scroller.setOffsetY(0);
      this.dataManager.pager.current = 1;
      this.dataManager.pagerCache = {};
      this.dataManager.clear();
    }
    this.dataManager.loadItems();
  }

  onLoadedForm() {
    this.cd.markForCheck();
  }

  clearAllFilters() {
    this.dataManager.dataFilter.clear();
    this.dataManager.events.onFilter();
  }

}
