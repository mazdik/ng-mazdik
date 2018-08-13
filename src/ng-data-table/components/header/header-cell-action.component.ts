import {
  Component, Input, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy
} from '@angular/core';
import {DataTable} from '../../base';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-datatable-header-cell-action',
  templateUrl: 'header-cell-action.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderCellActionComponent implements OnInit, OnDestroy {

  @Input() public table: DataTable;

  @HostBinding('class')
  get columnCssClasses(): any {
    return 'datatable-header-cell action-cell';
  }

  @HostBinding('style.width.px')
  get width(): number {
    return this.table.dimensions.actionColumnWidth;
  }

  get isCheckboxable(): boolean {
    return this.table.settings.selectionType === 'multiple';
  }

  get allRowsSelected(): boolean {
    const allRowsSelected = (this.table.rows &&
      this.table.selection.selectedRowIndexes &&
      this.table.selection.selectedRowIndexes.length === this.table.rows.length &&
      this.table.rows.length !== 0);

    return allRowsSelected;
  }

  private subscriptions: Subscription[] = [];

  constructor(public cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    const subFilter = this.table.events.filterSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subSelection = this.table.events.selectionSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subFilter);
    this.subscriptions.push(subSelection);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  clearAllFilters() {
    this.table.dataFilter.clear();
    this.table.events.onFilter();
  }

  onHeaderCheckboxClick() {
    if (this.allRowsSelected) {
      this.table.selection.clearSelection();
    } else {
      this.table.selection.selectAllRows(this.table.rows);
    }
  }

  filterActionEnabled(): boolean {
    const rowAction = this.table.settings.rowActionTemplate && this.table.dimensions.actionColumnWidth > 0;
    return !this.isCheckboxable || rowAction;
  }

}
