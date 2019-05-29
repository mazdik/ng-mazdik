import {
  Component, Input, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy
} from '@angular/core';
import {Column, DataTable} from '../../base';
import {Subscription} from 'rxjs';
import {ColumnMenuEventArgs} from '../../base/types';
import {findAncestor} from '../../../common/utils';

@Component({
  selector: 'dt-header-cell',
  templateUrl: 'header-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderCellComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Input() column: Column;

  @HostBinding('class.datatable-header-cell') cssClass = true;
  @HostBinding('class.dt-sticky') get cssSticky() {
    return this.column.frozen;
  }

  @HostBinding('attr.role') role = 'columnheader';

  @HostBinding('style.width.px')
  get width(): number {
    return this.column.width;
  }

  @HostBinding('attr.title')
  get name(): string {
    return this.column.title;
  }

  get direction() {
    const order = this.table.sorter.getOrder(this.column.name);
    return (order === -1) ? 'desc' : (order === 1) ? 'asc' : '';
  }

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    const subFilter = this.table.events.filterSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subSort = this.table.events.sortSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subFilter);
    this.subscriptions.push(subSort);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onSort() {
    if (this.column.sortable) {
      this.table.sorter.setOrder(this.column.name);
      this.table.events.onSort();
    }
  }

  clickColumnMenu(event: any, column: Column, isLast: boolean) {
    const el = event.target.parentNode;
    const header = findAncestor(event.target, 'dt-header');
    let left = el.offsetLeft;
    const top = header.offsetHeight;
    // left - scroll
    left = left - this.table.dimensions.offsetX;
    const width = this.table.dimensions.columnMenuWidth;
    if ((event.pageX + 1 + width - document.body.scrollLeft > window.innerWidth) || isLast) {
      left = left + column.width - width;
    }
    this.table.events.onColumnMenuClick({left, top, column} as ColumnMenuEventArgs);
  }

  isFiltered(): boolean {
    const field = (this.column.keyColumn) ? this.column.keyColumn : this.column.name;
    return this.table.dataFilter.hasFilter(field);
  }

}
