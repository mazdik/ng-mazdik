import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import {Column, DataTable, DataFilter} from '../../base';

@Component({
  selector: 'app-string-filter',
  templateUrl: 'string-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringFilterComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() table: DataTable;
  @Input() column: Column;
  @Input() isOpen: boolean;
  @Output() filterClose: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('filterInput') filterInput: any;

  filterTimeout: any;
  matchMode: string;
  value: any;
  operators: any[];
  defaultMatchMode = DataFilter.STARTS_WITH;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.operators = [
      {value: DataFilter.EQUALS, text: this.table.messages.equals},
      {value: DataFilter.NOT_EQUAL, text: this.table.messages.notEqual},
      {value: DataFilter.STARTS_WITH, text: this.table.messages.startsWith},
      {value: DataFilter.ENDS_WITH, text: this.table.messages.endsWith},
      {value: DataFilter.CONTAINS, text: this.table.messages.contains},
      {value: DataFilter.NOT_CONTAINS, text: this.table.messages.notContains},
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
    this.setFocus();
  }

  get isValueFilter() {
    return !this.table.dataFilter.isNonValueFilter(this.matchMode);
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
    this.table.dataFilter.setFilter(value, this.column.name, this.matchMode);
    this.table.events.onFilter();
    this.cd.markForCheck();
  }

  uncheckAll() {
    this.value = null;
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
      this.filter(this.value);
      this.filterClose.emit(true);
    } else if (this.value) {
      this.filter(this.value);
    }
  }

}
