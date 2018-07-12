import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation, OnDestroy, TemplateRef
} from '@angular/core';
import {ModalEditFormComponent} from '../modal-edit-form/modal-edit-form.component';
import {DataManager, Row, MenuItem} from '../../base';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class CrudTableComponent implements OnInit, OnDestroy {

  @Input() public dataManager: DataManager;
  @Output() select: EventEmitter<any> = new EventEmitter();
  @Output() rowsChanged: EventEmitter<boolean> = new EventEmitter();

  private subscriptions: Subscription[] = [];

  @ViewChild('modalEditForm') modalEditForm: ModalEditFormComponent;
  @ViewChild('rowActionTemplate') rowActionTemplate: TemplateRef<any>;

  constructor() {
  }

  ngOnInit() {
    this.initRowMenu();
    if (this.dataManager.settings.initLoad) {
      this.dataManager.getItems().then();
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
    const subEdit = this.dataManager.events.editSource$.subscribe((row) => {
      this.onEditComplete(row);
    });
    const subRows = this.dataManager.events.rowsChanged$.subscribe(() => {
      this.rowsChanged.emit(true);
    });
    this.subscriptions.push(subSelection);
    this.subscriptions.push(subFilter);
    this.subscriptions.push(subSort);
    this.subscriptions.push(subPage);
    this.subscriptions.push(subEdit);
    this.subscriptions.push(subRows);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  initRowMenu() {
    if (this.dataManager.settings.singleRowView) {
      this.dataManager.actionMenu.push(
        {
          label: this.dataManager.messages.titleDetailView,
          icon: 'icon icon-rightwards',
          command: (row) => this.viewAction(row),
        }
      );
    }
    if (this.dataManager.settings.crud) {
      this.dataManager.actionMenu.push(
        {
          label: this.dataManager.messages.titleUpdate,
          icon: 'icon icon-pencil',
          command: (row) => this.updateAction(row),
        }
      );
    }
  }

  onRowMenuClick(event: any, menuItem: MenuItem, row: Row) {
    this.dataManager.selectRow(row.$$index);
    menuItem.command(row);
  }

  onCreateAction() {
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
      this.dataManager.rowVirtual.resetPosition();
      this.dataManager.pager.current = 1;
      this.dataManager.pager.cache = {};
    }
    this.dataManager.getItems().then();
  }

  onSort() {
    if (this.dataManager.settings.virtualScroll) {
      this.dataManager.rowVirtual.resetPosition();
      this.dataManager.pager.current = 1;
      this.dataManager.pager.cache = {};
    }
    this.dataManager.getItems().then();
  }

  onSelectedRow() {
    this.select.emit(this.dataManager.selection.getSelectedRows(this.dataManager.rows));
  }

}
