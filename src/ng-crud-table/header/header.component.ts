import {Component, OnInit, Input, Output, EventEmitter, HostBinding} from '@angular/core';
import {DataTable} from '../models/data-table';
import {Column} from '../models/column';
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

  frozenColumns: Column[] = [];

  constructor() {
  }

  ngOnInit() {
    if (this.table.columns) {
      this.frozenColumns = [...this.table.frozenColumns];
      const actionColumn: Column = new Column({
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

  onSort(column: Column) {
    if (!column.sortable) {
      return;
    }
    this.table.sorter.setOrder(column.name);
    this.sort.emit(this.table.sorter.sortMeta);
  }

  clearAllFilters() {
    this.table.dataFilter.clear();
    this.clearFilters.emit(true);
  }

  clickColumnMenu(event, column: Column) {
    const el = event.target.parentNode;
    let left = el.offsetLeft;
    let top = el.offsetTop;
    const rowHeight = getHeight(el.parentNode);
    top = top + rowHeight;
    // datatable-row-left + offsetLeft
    left = left + el.parentNode.offsetLeft;

    this.showColumnMenu.emit({'top': top, 'left': left, 'column': column});
  }

  onColumnResized(width: number, column: Column): void {
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
