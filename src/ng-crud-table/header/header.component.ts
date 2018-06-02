import {
  Component, OnInit, Input, HostBinding, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy,
  ElementRef, ViewChild, ViewContainerRef
} from '@angular/core';
import {DataTable} from '../base/data-table';
import {Column} from '../base/column';
import {translate} from '../base/util';
import {Subscription} from 'rxjs';
import {ColumnMenuEventArgs} from '../types';

@Component({
  selector: 'app-datatable-header',
  templateUrl: 'header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HeaderComponent implements OnInit, OnDestroy {

  @Input() public table: DataTable;

  @HostBinding('class') cssClass = 'datatable-header';
  @ViewChild('headerTemplate', { read: ViewContainerRef }) headerTemplate: ViewContainerRef;

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef, private element: ElementRef) {
  }

  ngOnInit() {
    if (this.table.settings.columnResizeMode === 'aminated') {
      const subColumnResize = this.table.dataService.resizeSource$.subscribe(() => {
        this.cd.markForCheck();
      });
      this.subscriptions.push(subColumnResize);
    }
    const subColumnResizeEnd = this.table.dataService.resizeEndSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subScroll = this.table.dataService.scrollSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subFilter = this.table.dataService.filterSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subColumnResizeEnd);
    this.subscriptions.push(subScroll);
    this.subscriptions.push(subFilter);
  }

  ngOnDestroy() {
    if (this.headerTemplate) {
      this.headerTemplate.clear();
    }
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onSort(column: Column) {
    if (!column.sortable) {
      return;
    }
    this.table.sorter.setOrder(column.name);
    this.table.dataService.onSort();
  }

  clearAllFilters() {
    this.table.dataFilter.clear();
    this.table.dataService.onFilter();
  }

  clickColumnMenu(event: any, column: Column, isLast: boolean) {
    const el = event.target.parentNode;
    let left = el.offsetLeft;
    let top = el.offsetTop;
    top = top + this.element.nativeElement.offsetHeight;
    // datatable-row-left + offsetLeft
    if (el.parentNode.offsetLeft > 0) {
      left = left + el.parentNode.offsetLeft - this.table.offsetX;
    }
    let right = null;
    if (isLast) {
      left = null;
      right = 0;
    }

    this.table.dataService.onColumnMenuClick(<ColumnMenuEventArgs>{left, top, right, column});
  }

  stylesByGroup() {
    return translate(this.table.offsetX * -1, 0);
  }

}
