import {
  Component, OnInit, Input, HostBinding, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import {DataTable, Constants} from '../../base';
import {Subscription} from 'rxjs';
import {translate} from '../../base/util';
import {Row} from '../../types';

@Component({
  selector: 'app-datatable-summary-row',
  templateUrl: './summary-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryRowComponent implements OnInit, OnDestroy {

  @Input() public table: DataTable;
  @Input() public row: Row;

  private subscriptions: Subscription[] = [];

  @HostBinding('class')
  get cssClass() {
    const cls = 'datatable-body-row datatable-group-row';
    return cls;
  }

  @HostBinding('style.height.px')
  get rowHeight(): number {
    return this.table.dimensions.summaryRowHeight;
  }

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (this.table.settings.columnResizeMode === Constants.resizeAminated) {
      const subColumnResize = this.table.events.resizeSource$.subscribe(() => {
        this.cd.markForCheck();
      });
      this.subscriptions.push(subColumnResize);
    }
    const subColumnResizeEnd = this.table.events.resizeEndSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subRows = this.table.events.rowsChanged$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subScroll = this.table.events.scrollSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subColumnResizeEnd);
    this.subscriptions.push(subRows);
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  stylesByGroup() {
    return translate(this.table.dimensions.offsetX, 0);
  }

}
