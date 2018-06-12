import {
  Component, OnInit, Input, HostBinding, OnDestroy,
  ChangeDetectionStrategy, KeyValueDiffers, KeyValueDiffer, ChangeDetectorRef
} from '@angular/core';
import {DataTable} from '../base';
import {Subscription} from 'rxjs';
import {translate, addClass} from '../base/util';
import {Row} from '../types';

@Component({
  selector: 'app-datatable-body-row',
  templateUrl: './body-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyRowComponent implements OnInit, OnDestroy {

  @Input() public table: DataTable;
  @Input() public row: Row;

  private rowDiffer: KeyValueDiffer<{}, {}>;
  private subscriptions: Subscription[] = [];

  @HostBinding('class')
  get cssClass(): string {
    let cls = 'datatable-body-row';
    const rowClass = this.table.settings.rowClass;
    if (rowClass) {
      if (typeof rowClass === 'string') {
        cls += ' ' + rowClass;
      } else if (typeof rowClass === 'function') {
        const res = rowClass(this.row);
        cls = addClass(cls, res);
      }
    }
    if (this.table.dataSelection.isRowSelected(this.row.index)) {
      cls += ' row-selected';
    }
    return cls;
  }

  @HostBinding('style.height.px')
  get rowHeight(): number {
    return this.table.dimensions.rowHeight;
  }

  constructor(private differs: KeyValueDiffers, private cd: ChangeDetectorRef) {
    this.rowDiffer = this.differs.find({}).create();
  }

  ngOnInit(): void {
    if (this.table.settings.columnResizeMode === 'aminated') {
      const subColumnResize = this.table.events.resizeSource$.subscribe(() => {
        this.cd.markForCheck();
      });
      this.subscriptions.push(subColumnResize);
    }
    const subColumnResizeEnd = this.table.events.resizeEndSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subRows = this.table.events.rowsChanged$.subscribe(() => {
      if (this.rowDiffer.diff(this.row)) {
        this.cd.markForCheck();
      }
    });
    const subScroll = this.table.events.scrollSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subSort = this.table.events.sortSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subPage = this.table.events.pageSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subColumnResizeEnd);
    this.subscriptions.push(subRows);
    this.subscriptions.push(subScroll);
    this.subscriptions.push(subSort);
    this.subscriptions.push(subPage);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  stylesByGroup() {
    return translate(this.table.offsetX, 0);
  }

}
