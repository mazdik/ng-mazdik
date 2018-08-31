import {
  Component, Input, HostBinding, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import {DataTable, Row} from '../../base';
import {Subscription} from 'rxjs';
import {translate} from '../../base/util';

@Component({
  selector: 'dt-body',
  templateUrl: './body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Input() loading: boolean;

  @HostBinding('class') cssClass = 'datatable-body';

  rowTrackingFn: Function;
  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
    this.rowTrackingFn = function (index: number, row: any): any {
      if (this.table.settings.trackByProp) {
        return `${index}-${this.table.settings.trackByProp}`;
      } else {
        return index;
      }
    }.bind(this);
  }

  @HostBinding('style.height')
  get bodyHeight() {
    if (this.table.dimensions.bodyHeight) {
      return this.table.dimensions.bodyHeight + 'px';
    } else {
      return 'auto';
    }
  }

  ngOnInit(): void {
    const subRows = this.table.events.rowsChanged$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subScroll = this.table.events.scrollSource$.subscribe((event) => {
      if (event.direction) {
        this.table.chunkRows();
        this.table.rowVirtual.updatePage(event.direction);
      }
      this.cd.markForCheck();
    });
    const subFilter = this.table.events.filterSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subRows);
    this.subscriptions.push(subScroll);
    this.subscriptions.push(subFilter);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  stylesByGroup() {
    return translate(this.table.dimensions.offsetX, 0);
  }

  styleTranslate(row: Row) {
    if (this.table.settings.virtualScroll) {
      return `translate3d(0, ${row.$$offset}px, 0)`;
    }
  }

  getScrollHeight() {
    if (this.table.settings.virtualScroll) {
      return this.table.dimensions.scrollHeight;
    }
  }

}
