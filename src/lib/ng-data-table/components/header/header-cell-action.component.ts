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

  @HostBinding('class.datatable-header-cell') cssClass = true;
  @HostBinding('class.action-cell') cssAction = true;
  @HostBinding('class.dt-sticky') cssSticky = true;

  @HostBinding('attr.role') role = 'columnheader';

  @HostBinding('style.width.px')
  get width(): number {
    return this.table.dimensions.actionColumnWidth;
  }

  get isCheckboxable(): boolean {
    return this.table.selection.multiple;
  }

  get allRowsSelected(): boolean {
    const selectedIndexes = this.table.rows.map(x => x.$$index);
    return this.table.selection.allSelected(selectedIndexes);
  }

  get partiallySelected(): boolean {
    return !this.table.selection.isEmpty() && !this.allRowsSelected;
  }

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {}

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

  onHeaderCheckboxClick() {
    if (this.allRowsSelected) {
      this.table.selection.clearSelection();
    } else {
      const selectedIndexes = this.table.rows.map(x => x.$$index);
      this.table.selection.selectAll(selectedIndexes);
    }
  }

}
