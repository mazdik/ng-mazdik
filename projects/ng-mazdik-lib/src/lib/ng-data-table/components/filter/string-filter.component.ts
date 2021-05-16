import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ChangeDetectionStrategy, OnChanges, ViewChild
} from '@angular/core';
import { Column, DataTable, FilterOperator } from '../../base';
import { Keys } from '../../../common';

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

  @ViewChild('filterInput', { static: false }) filterInput: any;

  matchMode: string;
  value: any;
  operators: any[];
  defaultMatchMode = FilterOperator.STARTS_WITH;

  constructor() { }

  ngOnInit(): void {
    this.operators = [
      { value: FilterOperator.EQUALS, text: this.table.messages.equals },
      { value: FilterOperator.NOT_EQUAL, text: this.table.messages.notEqual },
      { value: FilterOperator.STARTS_WITH, text: this.table.messages.startsWith },
      { value: FilterOperator.ENDS_WITH, text: this.table.messages.endsWith },
      { value: FilterOperator.CONTAINS, text: this.table.messages.contains },
      { value: FilterOperator.NOT_CONTAINS, text: this.table.messages.notContains },
      { value: FilterOperator.IS_EMPTY, text: this.table.messages.isEmpty },
      { value: FilterOperator.IS_NOT_EMPTY, text: this.table.messages.isNotEmpty },
    ];
  }

  ngAfterViewInit(): void {
    this.setFocus();
  }

  ngOnChanges(): void {
    this.matchMode = this.table.dataFilter.getFilterMatchMode(this.column.name) || this.defaultMatchMode;
    this.value = this.table.dataFilter.getFilterValue(this.column.name);
    this.setFocus();
  }

  get isValueFilter(): boolean {
    return !this.table.dataFilter.isNonValueFilter(this.matchMode);
  }

  saveFilter(): void {
    this.table.dataFilter.setFilter(this.value, this.column.name, this.matchMode, null, this.column.dataType);
    this.table.events.onFilter();
  }

  setFocus(): void {
    if (this.filterInput && this.isValueFilter) {
      setTimeout(() => {
        this.filterInput.nativeElement.focus();
      }, 1);
    }
  }

  onModeChange(): void {
    if (!this.isValueFilter) {
      this.value = 0;
      this.saveFilter();
      this.filterClose.emit(true);
    } else if (this.value === 0) {
      this.value = null;
    }
  }

  onClickOk(): void {
    this.saveFilter();
    this.filterClose.emit(true);
  }

  onClickCancel(): void {
    this.filterClose.emit(true);
  }

  onClickClear(): void {
    this.value = null;
    this.matchMode = this.defaultMatchMode;
    this.saveFilter();
    this.filterClose.emit(true);
  }

  onChangeSelect(event: Event): void {
    const element = event.target as HTMLSelectElement;
    this.matchMode = element.value;
    this.onModeChange();
  }

  onInputFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.value = element.value;
  }

  onKeyPressFilter(event: KeyboardEvent): void {
    if (event.which === Keys.ENTER) {
      this.onClickOk();
    }
  }

}
