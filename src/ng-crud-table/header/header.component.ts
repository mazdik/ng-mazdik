import {Component, OnInit, Input, Output, EventEmitter, HostBinding, ChangeDetectionStrategy} from '@angular/core';
import {Filter, SortMeta} from '../types';
import {DomUtils} from '../utils/dom-utils';
import {ColumnModel} from '../models/column.model';
import {DataTable} from '../models/data-table';


@Component({
  selector: 'datatable-header',
  templateUrl: 'header.component.html',
  host: {
    class: 'datatable-header'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderComponent implements OnInit {

  @Input() public table: DataTable;
  @Input() public filters: Filter = {};
  @Input() public sortMeta: SortMeta;
  @Input() offsetX: number;

  @Output() onSort: EventEmitter<any> = new EventEmitter();
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Output() onShowColumnMenu: EventEmitter<any> = new EventEmitter();
  @Output() onClearAllFilters: EventEmitter<any> = new EventEmitter();
  @Output() onResize: EventEmitter<any> = new EventEmitter();

  frozenColumns: ColumnModel[] = [];

  constructor() {
  }

  ngOnInit() {
    if (this.table.columns) {
      this.frozenColumns = [...this.table.frozenColumns];
      const actionColumn: ColumnModel = new ColumnModel({
        title: '',
        name: '',
        sortable: false,
        filter: false,
        resizeable: false,
        width: this.table.actionColumnWidth
      });
      this.frozenColumns.unshift(actionColumn);
    }
  }

  sort(event, column: ColumnModel) {
    if (!column.sortable) {
      return;
    }
    this.sortMeta.order = (this.sortMeta.field === column.name) ? this.sortMeta.order * -1 : 1;
    this.sortMeta.field = column.name;
    this.onSort.emit({
      sortMeta: this.sortMeta
    });
  }

  getSortOrder(column: ColumnModel) {
    let order = 0;
    if (this.sortMeta.field && this.sortMeta.field === column.name) {
      order = this.sortMeta.order;
    }
    return order;
  }

  isFilter(column: ColumnModel): boolean {
    let length = 0;
    if (this.filters[column.name] && this.filters[column.name].value) {
      length = this.filters[column.name].value.trim().length;
    }
    return length > 0;
  }

  filter(event) {
    this.filters = event;
    this.onFilter.emit(this.filters);
  }

  clearAllFilters() {
    this.filters = {};
    this.onClearAllFilters.emit(true);
  }

  hasFilter() {
    let empty = true;
    for (const prop in this.filters) {
      if (this.filters.hasOwnProperty(prop)) {
        empty = false;
        break;
      }
    }
    return !empty;
  }

  showColumnMenu(event, column: ColumnModel) {
    const el = event.target.parentNode;
    let left = el.offsetLeft;
    let top = el.offsetTop;
    const rowHeight = DomUtils.getHeight(el.parentNode);
    top = top + rowHeight;
    // datatable-row-left + offsetLeft
    left = left + el.parentNode.offsetLeft;

    this.onShowColumnMenu.emit({'top': top, 'left': left, 'column': column});
  }

  onColumnResized(width: number, column: ColumnModel): void {

    if (width <= this.table.minWidthColumn) {
      width = this.table.minWidthColumn;
    } else if (width >= this.table.maxWidthColumn) {
      width = this.table.maxWidthColumn;
    }
    this.table.setColumnWidth(column, width);
    this.onResize.emit({
      column: column,
      newValue: width
    });
  }

  stylesByGroup() {
    const styles: any = {};
    styles.left = `${this.offsetX * -1}px`;
    return styles;
  }

  columnTrackingFn(index: number, column: any): any {
    return column.name;
  }

}
