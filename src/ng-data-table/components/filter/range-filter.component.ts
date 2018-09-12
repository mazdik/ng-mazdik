import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ChangeDetectionStrategy,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import {Column, DataTable, DataFilter} from '../../base';

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

  filterTimeout: any;
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

  ngOnChanges(changes: SimpleChanges): void {
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

  onFilterInput() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filter(this.value);
      this.filterTimeout = null;
    }, this.table.settings.filterDelay);
  }

  filter(value) {
    this.table.dataFilter.setFilter(value, this.column.name, this.matchMode, this.valueTo, this.column.dataType);
    this.table.events.onFilter();
  }

  uncheckAll() {
    this.value = null;
    this.valueTo = null;
    this.matchMode = this.defaultMatchMode;
    this.filter(this.value);
    this.filterClose.emit(true);
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
      this.filter(this.value);
      this.filterClose.emit(true);
    } else if (this.value) {
      this.filter(this.value);
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
    this.filter(dt.toISOString().slice(0, 16));
    this.filterClose.emit(true);
  }


}
