import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy, ViewEncapsulation,
  TemplateRef, HostBinding, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {ModalEditFormComponent} from '../../../lib/modal-edit-form';
import {DataManager, Row} from '../../base';
import {Subscription} from 'rxjs';
import {ContextMenuComponent, MenuEventArgs} from '../../../lib/context-menu';
import {DataTableComponent} from '../../../ng-data-table';
import {MenuItem} from '../../../lib/common';

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: [
    'crud-table.component.css',
    '../../../lib/styles/icons.css',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CrudTableComponent implements OnInit, OnDestroy {

  @Input() dataManager: DataManager;
  @Output() select: EventEmitter<any> = new EventEmitter();
  @Output() rowsChanged: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('modalEditForm') modalEditForm: ModalEditFormComponent;
  @ViewChild('rowActionTemplate') rowActionTemplate: TemplateRef<any>;
  @ViewChild('rowMenu') rowMenu: ContextMenuComponent;
  @ViewChild('alert') alert: ElementRef;
  @ViewChild('toolbar') toolbar: any;
  @ViewChild(DataTableComponent) dt: DataTableComponent;

  @HostBinding('class') cssClass = 'datatable crud-table';

  actionMenu: MenuItem[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.initRowMenu();
    if (this.dataManager.settings.initLoad) {
      this.dataManager.loadItems().catch(() => this.cd.markForCheck());
    }
    this.dataManager.settings.rowActionTemplate = this.rowActionTemplate;

    const subSelection = this.dataManager.events.selectionSource$.subscribe(() => {
      this.onSelectedRow();
    });
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
      requestAnimationFrame(() => {
        this.cd.detectChanges();
      });
    });
    this.subscriptions.push(subSelection);
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
          label: this.dataManager.messages.titleDetailView,
          icon: 'dt-icon dt-icon-rightwards',
          command: (row) => this.viewAction(row),
        }
      );
    }
    if (this.dataManager.settings.crud) {
      this.actionMenu.push(
        {
          label: this.dataManager.messages.titleUpdate,
          icon: 'dt-icon dt-icon-pencil',
          command: (row) => this.updateAction(row),
        },
        {
          label: this.dataManager.messages.refresh,
          icon: 'dt-icon dt-icon-reload',
          command: (row) => this.dataManager.refreshRow(row),
        },
        {
          label: this.dataManager.messages.revertChanges,
          icon: 'dt-icon dt-icon-return',
          command: (row) => this.dataManager.revertRowChanges(row),
          disabled: true,
        },
        {
          label: this.dataManager.messages.save,
          icon: 'dt-icon dt-icon-ok',
          command: (row) => this.dataManager.update(row),
          disabled: true,
        },
        {
          label: this.dataManager.messages.delete,
          icon: 'dt-icon dt-icon-remove',
          command: (row) => {
            if (confirm(this.dataManager.messages.delete + '?')) {
              this.dataManager.delete(row);
            }
          },
        },
        {
          label: this.dataManager.messages.duplicate,
          icon: 'dt-icon dt-icon-plus',
          command: (row) => this.duplicateAction(row),
        },
      );
    }
  }

  onRowMenuClick(event: any, row: Row) {
    const el = event.target.parentNode.parentNode.parentNode; // row
    const rowHeight = el.offsetHeight;
    const rowTop = el.offsetTop + rowHeight;

    const rowChanged = this.dataManager.rowChanged(row);
    let menuIndex = this.actionMenu.findIndex(x => x.label === this.dataManager.messages.revertChanges);
    if (menuIndex > -1) {
      this.actionMenu[menuIndex].disabled = !rowChanged;
    }
    menuIndex = this.actionMenu.findIndex(x => x.label === this.dataManager.messages.save);
    if (menuIndex > -1) {
      const rowIsValid = this.dataManager.rowIsValid(row);
      this.actionMenu[menuIndex].disabled = !rowChanged || !rowIsValid;
    }

    const left = 0;
    const alertHeight = (this.alert) ? this.alert.nativeElement.offsetHeight : 0;
    const toolbarHeight = (this.toolbar) ? this.toolbar.getHeight() : 0;
    let top = alertHeight + toolbarHeight + this.dt.header.getHeight();
    top += rowTop;
    if (this.dataManager.settings.virtualScroll) {
      top -= (this.dataManager.dimensions.offsetY) ? 17 : 0;
    } else {
      top -= this.dataManager.dimensions.offsetY;
    }
    this.rowMenu.show(<MenuEventArgs>{originalEvent: event, data: row, left: left, top: top});
  }

  createAction() {
    this.dataManager.item = <Row>{};
    this.modalEditForm.isNewItem = true;
    this.modalEditForm.detailView = false;
    this.modalEditForm.open();
  }

  viewAction(row: Row) {
    this.dataManager.item = Object.assign({}, row);
    this.modalEditForm.isNewItem = false;
    this.modalEditForm.detailView = true;
    this.modalEditForm.open();
  }

  updateAction(row: Row) {
    this.dataManager.item = Object.assign({}, row);
    this.modalEditForm.isNewItem = false;
    this.modalEditForm.detailView = false;
    this.modalEditForm.open();
  }

  duplicateAction(row: Row) {
    this.dataManager.item = this.dataManager.cloneRow(row);
    this.modalEditForm.isNewItem = true;
    this.modalEditForm.detailView = false;
    this.modalEditForm.open();
  }

  onPageChanged() {
    this.dataManager.loadItems();
  }

  onFilter() {
    if (this.dataManager.settings.virtualScroll) {
      this.dt.body.scroller.setOffsetY(0);
      this.dataManager.pager.current = 1;
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

  onSelectedRow() {
    this.select.emit(this.dataManager.getSelection());
  }

  onLoadedForm() {
    this.cd.markForCheck();
  }

}
