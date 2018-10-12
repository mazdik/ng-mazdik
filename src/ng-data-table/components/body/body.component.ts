import {
  Component, Input, HostBinding, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ViewChild
} from '@angular/core';
import {DataTable} from '../../base';
import {Subscription} from 'rxjs';
import {ScrollerComponent} from '../../../lib/scroller';

@Component({
  selector: 'dt-body',
  templateUrl: './body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Input() loading: boolean;

  @HostBinding('class') cssClass = 'datatable-body';
  @ViewChild(ScrollerComponent) scroller: ScrollerComponent;

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

  ngOnInit(): void {
    const subRows = this.table.events.rowsChanged$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subFilter = this.table.events.filterSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subRows);
    this.subscriptions.push(subFilter);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  updatePage(direction: string) {
    if (this.table.settings.virtualScroll && direction && this.table.pager) {
      let page = this.scroller.start / this.scroller.itemsPerRow;
      page = Math.ceil(page) + 1;
      if (page !== this.table.pager.current) {
        this.table.pager.current = page;
        this.table.events.onPage();
      }
    }
  }

  onScroll(event: any) {
    this.table.dimensions.offsetY = event.scrollYPos;
    this.table.dimensions.offsetX = event.scrollXPos;
    this.table.events.onScroll(event);
    if (event.direction) {
      this.updatePage(event.direction);
    }
    this.cd.markForCheck();
  }

}
