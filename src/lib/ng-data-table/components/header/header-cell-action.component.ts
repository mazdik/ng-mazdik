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

}
