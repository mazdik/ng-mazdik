import {
  Component, OnInit, Input, HostBinding, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef
} from '@angular/core';
import {DataTable, ColumnResizeMode, Row} from '../../base';
import {Subscription} from 'rxjs';

@Component({
  selector: 'dt-body-group-row',
  templateUrl: './body-group-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyGroupRowComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Input() row: Row;

  @ViewChild('rowLeft') rowLeft: ElementRef;

  private subscriptions: Subscription[] = [];

  @HostBinding('class') cssClass = 'datatable-body-row datatable-group-header';

  @HostBinding('attr.role') role = 'row';

  @HostBinding('style.height.px')
  get rowHeight(): number {
    return this.table.dimensions.rowHeight;
  }

  @HostBinding('style.width.px')
  get rowWidth(): number {
    return this.table.dimensions.columnsTotalWidth + 1;
  }

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (this.table.settings.columnResizeMode === ColumnResizeMode.Aminated) {
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
      this.rowLeft.nativeElement.style.transform = `translate3d(${this.table.dimensions.offsetX}px, 0, 0)`;
      this.cd.markForCheck();
    });
    this.subscriptions.push(subColumnResizeEnd);
    this.subscriptions.push(subRows);
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
