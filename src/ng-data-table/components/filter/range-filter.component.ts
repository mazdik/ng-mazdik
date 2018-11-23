import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ChangeDetectionStrategy, OnChanges, ViewChild
} from '@angular/core';
import {Column, DataTable, DataFilter} from '../../base';
import {inputFormattedDate} from '../../../lib/common/utils';

@Component({
  selector: 'app-range-filter',
  templateUrl: 'range-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeFilterComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() table: DataTable;
  @Input() column: Column;
  @Input() isOpen: boolean;
  @Output() filterClose: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('filterInput') filterInput: any;

  matchMode: string;
  value: any;
  valueTo: any;
  operators: any[];
  defaultMatchMode = DataFilter.EQUALS;

  constructor() {
  }

  ngOnInit() {
    this.operators = [
      {value: DataFilter.EQUALS, text: this.table.messages.equals},
      {value: DataFilter.NOT_EQUAL, text: this.table.messages.notEqual},
      {value: DataFilter.GREATER_THAN, text: this.table.messages.greaterThan},
      {value: DataFilter.GREATER_THAN_OR_EQUAL, text: this.table.messages.greaterThanOrEqual},
      {value: DataFilter.LESS_THAN, text: this.table.messages.lessThan},
      {value: DataFilter.LESS_THAN_OR_EQUAL, text: this.table.messages.lessThanOrEqual},
      {value: DataFilter.IN_RANGE, text: this.table.messages.inRange},
      {value: DataFilter.IS_EMPTY, text: this.table.messages.isEmpty},
      {value: DataFilter.IS_NOT_EMPTY, text: this.table.messages.isNotEmpty},
    ];
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  ngOnChanges(): void {
    this.matchMode = this.table.dataFilter.getFilterMatchMode(this.column.name) || this.defaultMatchMode;
    this.value = this.table.dataFilter.getFilterValue(this.column.name);
    this.valueTo = this.table.dataFilter.getFilterValueTo(this.column.name);
    this.setFocus();
  }

  get isValueFilter() {
    return !this.table.dataFilter.isNonValueFilter(this.matchMode);
  }

  get isRangeFilter() {
    return this.matchMode === DataFilter.IN_RANGE;
  }

  saveFilter() {
    this.column.setFilter(this.value, this.matchMode, this.valueTo);
    this.table.events.onFilter();
  }

  setFocus() {
    if (this.filterInput && this.isValueFilter) {
      setTimeout(() => {
        this.filterInput.nativeElement.focus();
      }, 1);
    }
  }

  onModeChange() {
    if (!this.isValueFilter) {
      this.value = 0;
      this.valueTo = null;
      this.saveFilter();
      this.filterClose.emit(true);
    } else if (this.value === 0) {
      this.value = null;
    }
  }

  lastDate(name: string) {
    let dt: Date;
    if (name === 'year') {
      dt = new Date();
      dt.setMonth(dt.getMonth() - 12);
    } else if (name === 'month') {
      dt = new Date();
      dt.setMonth(dt.getMonth() - 1);
    } else if (name === 'day') {
      dt = new Date(Date.now() + -1 * 24 * 3600 * 1000);
    } else if (name === 'hour') {
      dt = new Date(Date.now() + -1 * 3600 * 1000);
    }
    this.matchMode = DataFilter.GREATER_THAN_OR_EQUAL;
    this.value = inputFormattedDate(this.column.type, dt.toISOString());
    this.saveFilter();
    this.filterClose.emit(true);
  }

  onClickOk() {
    this.saveFilter();
    this.filterClose.emit(true);
  }

  onClickCancel() {
    this.filterClose.emit(true);
  }

  onClickClear() {
    this.value = null;
    this.valueTo = null;
    this.matchMode = this.defaultMatchMode;
    this.saveFilter();
    this.filterClose.emit(true);
  }

}
