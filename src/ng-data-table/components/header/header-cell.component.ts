import {
  Component, Input, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy
} from '@angular/core';
import {Column, DataTable} from '../../base';
import {Subscription} from 'rxjs';
import {ColumnMenuEventArgs} from '../../base/types';

@Component({
  selector: 'dt-header-cell',
  templateUrl: 'header-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderCellComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;

  @Input()
  set column(column: Column) {
    this._column = column;
    this.cellContext.column = column;
  }

  get column(): Column {
    return this._column;
  }

  @HostBinding('class')
  get columnCssClasses(): string {
    let cls = 'datatable-header-cell';
    if (this.column.headerCellClass) {
      cls += ' ' + this.column.headerCellClass;
    }
    return cls;
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

  cellContext: any = {
    column: this.column,
  };
  private _column: Column;
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

  onSort(column: Column) {
    if (!column.sortable) {
      return;
    }
    this.table.sorter.setOrder(column.name);
    this.table.events.onSort();
  }

  clickColumnMenu(event: any, column: Column, isLast: boolean) {
    const el = event.target.parentNode;
    let left = el.offsetLeft;
    let top = el.offsetTop;
    top = top + this.table.dimensions.headerRowHeight + (this.table.dimensions.headerTemplateHeight || 0);
    // datatable-row-left + offsetLeft
    if (el.parentNode.offsetLeft > 0) {
      left = left + el.parentNode.offsetLeft - this.table.dimensions.offsetX;
    }
    const width = this.table.dimensions.columnMenuWidth;
    if ((event.pageX + 1 + width - document.body.scrollLeft > window.innerWidth) || isLast) {
      left = left + column.width - width;
    }
    this.table.events.onColumnMenuClick(<ColumnMenuEventArgs>{left, top, column});
  }

  isFiltered(): boolean {
    const field = (this.column.keyColumn) ? this.column.keyColumn : this.column.name;
    return this.table.dataFilter.isFilter(field);
  }

}
