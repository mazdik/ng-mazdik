import {Component, OnInit, Input, HostBinding} from '@angular/core';
import {DataTable} from '../base/data-table';
import {Column} from '../base/column';
import {getHeight} from '../base/util';

@Component({
  selector: 'app-datatable-header',
  templateUrl: 'header.component.html',
})

export class HeaderComponent implements OnInit {

  @Input() public table: DataTable;
  @Input() public offsetX: number;

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
    this.table.dataService.onSort();
  }

  clearAllFilters() {
    this.table.dataFilter.clear();
    this.table.dataService.onFilter();
  }

  clickColumnMenu(event, column: Column) {
    const el = event.target.parentNode;
    let left = el.offsetLeft;
    let top = el.offsetTop;
    const rowHeight = getHeight(el.parentNode);
    top = top + rowHeight;
    // datatable-row-left + offsetLeft
    left = left + el.parentNode.offsetLeft;

    this.table.dataService.onColumnMenuClick({'top': top, 'left': left, 'column': column});
  }

  stylesByGroup() {
    const styles: any = {};
    styles.left = `${this.offsetX * -1}px`;
    return styles;
  }

}
