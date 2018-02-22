import {Component, OnInit, Input, HostBinding, OnDestroy} from '@angular/core';
import {DataTable} from '../base/data-table';
import {Column} from '../base/column';
import {getHeight, translate} from '../base/util';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-datatable-header',
  templateUrl: 'header.component.html',
})

export class HeaderComponent implements OnInit, OnDestroy {

  @Input() public table: DataTable;

  @HostBinding('class') cssClass = 'datatable-header';

  frozenColumns: Column[] = [];
  private subscriptions: Subscription[] = [];

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
    const subScroll = this.table.dataService.scrollSource$.subscribe(() => {

    });
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
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
    return translate(this.table.offsetX * -1, 0);
  }

}
