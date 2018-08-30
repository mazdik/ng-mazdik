import {
  Component, Input, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy
} from '@angular/core';
import {DataTable} from '../../base';
import {Subscription} from 'rxjs';

@Component({
  selector: 'dt-header-cell-action',
  templateUrl: 'header-cell-action.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderCellActionComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;

  @HostBinding('class') cssClass = 'datatable-header-cell action-cell';
  @HostBinding('attr.role') role = 'columnheader';

  @HostBinding('style.width.px')
  get width(): number {
    return this.table.dimensions.actionColumnWidth;
  }

  get isCheckboxable(): boolean {
    return this.table.selection.multiple;
  }

  get allRowsSelected(): boolean {
    return this.table.selection.allRowsSelected(this.table.rows);
  }

  get partiallySelected(): boolean {
    return !this.table.selection.isEmpty() && !this.allRowsSelected;
  }

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
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
