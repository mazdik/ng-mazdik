import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ChangeDetectionStrategy, OnChanges, ViewChild
} from '@angular/core';
import {Column, DataTable, FilterOperator} from '../../base';
import {Keys} from '../../../common';

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

  @ViewChild('filterInput', {static: false}) filterInput: any;

  matchMode: string;
  value: any;
  operators: any[];
  defaultMatchMode = FilterOperator.STARTS_WITH;

  constructor() {}

  ngOnInit() {
    this.operators = [
      {value: FilterOperator.EQUALS, text: this.table.messages.equals},
      {value: FilterOperator.NOT_EQUAL, text: this.table.messages.notEqual},
      {value: FilterOperator.STARTS_WITH, text: this.table.messages.startsWith},
      {value: FilterOperator.ENDS_WITH, text: this.table.messages.endsWith},
      {value: FilterOperator.CONTAINS, text: this.table.messages.contains},
      {value: FilterOperator.NOT_CONTAINS, text: this.table.messages.notContains},
      {value: FilterOperator.IS_EMPTY, text: this.table.messages.isEmpty},
      {value: FilterOperator.IS_NOT_EMPTY, text: this.table.messages.isNotEmpty},
    ];
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  ngOnChanges(): void {
    this.matchMode = this.table.dataFilter.getFilterMatchMode(this.column.name) || this.defaultMatchMode;
    this.value = this.table.dataFilter.getFilterValue(this.column.name);
    this.setFocus();
  }

  get isValueFilter() {
    return !this.table.dataFilter.isNonValueFilter(this.matchMode);
  }

  saveFilter() {
    this.table.dataFilter.setFilter(this.value, this.column.name, this.matchMode, null, this.column.dataType);
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
      this.saveFilter();
      this.filterClose.emit(true);
    } else if (this.value === 0) {
      this.value = null;
    }
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
    this.matchMode = this.defaultMatchMode;
    this.saveFilter();
    this.filterClose.emit(true);
  }

  onKeyPressFilterInput(event: KeyboardEvent) {
    if (event.which === Keys.ENTER) {
      this.onClickOk();
    }
  }

}
