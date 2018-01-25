import {Component, OnInit, Input, Output, EventEmitter, HostBinding} from '@angular/core';
import {ColumnModel, DataTable} from '../types';
import {getHeight} from '../utils/dom-utils';


@Component({
  selector: 'app-datatable-header',
  templateUrl: 'header.component.html',
})

export class HeaderComponent implements OnInit {

  @Input() public table: DataTable;
  @Input() public offsetX: number;

  @Output() sort: EventEmitter<any> = new EventEmitter();
  @Output() showColumnMenu: EventEmitter<any> = new EventEmitter();
  @Output() clearFilters: EventEmitter<any> = new EventEmitter();

  @HostBinding('class') cssClass = 'datatable-header';

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

  onSort(column: ColumnModel) {
    if (!column.sortable) {
      return;
    }
    this.table.setSortOrder(column);
    this.sort.emit({
      sortMeta: this.table.sortMeta
    });
  }

  getSortOrderIcon(column: ColumnModel) {
    let icon: string = '';
    if (this.table.getSortOrder(column) === -1) {
      icon = 'icon-down';
    } else if (this.table.getSortOrder(column) === 1) {
      icon = 'icon-up';
    }
    return icon;
  }

  clearAllFilters() {
    this.table.filters = {};
    this.clearFilters.emit(true);
  }

  clickColumnMenu(event, column: ColumnModel) {
    const el = event.target.parentNode;
    let left = el.offsetLeft;
    let top = el.offsetTop;
    const rowHeight = getHeight(el.parentNode);
    top = top + rowHeight;
    // datatable-row-left + offsetLeft
    left = left + el.parentNode.offsetLeft;

    this.showColumnMenu.emit({'top': top, 'left': left, 'column': column});
  }

  onColumnResized(width: number, column: ColumnModel): void {
    if (width <= this.table.minWidthColumn) {
      width = this.table.minWidthColumn;
    } else if (width >= this.table.maxWidthColumn) {
      width = this.table.maxWidthColumn;
    }
    this.table.setColumnWidth(column, width);
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
