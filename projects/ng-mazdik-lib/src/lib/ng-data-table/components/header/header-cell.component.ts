import {
  Component, Input, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy
} from '@angular/core';
import {Column, DataTable, EventHelper} from '../../base';
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
    const subSelection = this.table.events.selectionSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subFilter);
    this.subscriptions.push(subSort);
    this.subscriptions.push(subSelection);
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

  clickColumnMenu(event: MouseEvent, column: Column) {
    const {left, top} = EventHelper.getColumnPosition(event, this.table.dimensions.columnMenuWidth);
    this.table.events.onColumnMenuClick({left, top, column} as ColumnMenuEventArgs);
  }

  isFiltered(): boolean {
    const field = (this.column.keyColumn) ? this.column.keyColumn : this.column.name;
    return this.table.dataFilter.hasFilter(field);
  }

}
