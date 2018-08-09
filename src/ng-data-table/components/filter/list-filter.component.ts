import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import {SelectOption} from '../../types';
import {Column, DataTable, DataFilter} from '../../base';

@Component({
  selector: 'app-list-filter',
  templateUrl: 'list-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListFilterComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() table: DataTable;
  @Input() column: Column;
  @Input() isOpen: boolean;
  @Output() filterClose: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('filterInput') filterInput: any;

  selectedOptions: any;
  searchFilterText: string = '';
  loading: boolean;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setFocus();
    this.clearSearch();
    this.selectedOptions = this.table.dataFilter.getFilterValue(this.column.name);
    if (this.isOpen) {
      this.loading = true;
      this.column.getFilterValues().then((res) => {
        this.column.filterValues = res;
        this.loading = false;
        this.cd.markForCheck();
      }).catch(() => {
        this.loading = false;
        this.cd.markForCheck();
      });
    }
  }

  clearSearch() {
    this.searchFilterText = '';
  }

  setSelectedOptions(value: any) {
    if (!this.selectedOptions) {
      this.selectedOptions = [];
    }
    const index = this.selectedOptions.indexOf(value);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      if (this.column.selectionLimit === 0 || this.selectedOptions.length < this.column.selectionLimit) {
        this.selectedOptions.push(value);
      } else {
        this.selectedOptions.push(value);
        this.selectedOptions.shift();
      }
    }
  }

  setSelected(value: any) {
    this.setSelectedOptions(value);
    this.filter(this.selectedOptions, this.column.name);
    this.filterClose.emit(true);
  }

  checkAll() {
    if (!this.loading) {
      this.selectedOptions = this.column.filterValues.map(option => option.id);
      this.filter(this.selectedOptions, this.column.name);
      this.filterClose.emit(true);
    }
  }

  uncheckAll() {
    this.selectedOptions = [];
    this.filter(this.selectedOptions, this.column.name);
    this.filterClose.emit(true);
  }

  isSelected(option: SelectOption): boolean {
    return this.selectedOptions && this.selectedOptions.indexOf(option.id) > -1;
  }

  filter(value: any[], field: string) {
    const mode = value.length ? DataFilter.IN : DataFilter.EQUALS;
    this.table.dataFilter.setFilter(value, field, mode);
    this.table.events.onFilter();
  }

  setFocus() {
    if (this.filterInput) {
      setTimeout(() => {
        this.filterInput.nativeElement.focus();
      }, 1);
    }
  }

}
