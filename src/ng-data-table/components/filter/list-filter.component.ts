import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
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

  selectedOptions: any[] = [];
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
    if (this.isOpen) {
      this.setFocus();
      this.clearSearch();
      this.selectedOptions = this.table.dataFilter.getFilterValue(this.column.name) || [];
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
    if (!this.isSelected(value)) {
      if (!this.column.multiSelectFilter) {
        this.selectedOptions = [];
      }
      this.selectedOptions.push(value);
    }
  }

  setSelected(value: any) {
    this.setSelectedOptions(value);
    if (!this.column.multiSelectFilter) {
      this.filter(this.selectedOptions, this.column.name);
      this.filterClose.emit(true);
    }
  }

  checkAll() {
    if (!this.loading) {
      this.selectedOptions = this.column.filterValues.map(option => option.id);
      if (!this.column.multiSelectFilter) {
        this.filter(this.selectedOptions, this.column.name);
        this.filterClose.emit(true);
      }
    }
  }

  uncheckAll() {
    this.selectedOptions = [];
    if (!this.column.multiSelectFilter) {
      this.filter(this.selectedOptions, this.column.name);
      this.filterClose.emit(true);
    }
  }

  isSelected(value: any): boolean {
    return this.selectedOptions.indexOf(value) > -1;
  }

  filter(value: any[] = [], field: string) {
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

  onClickOk() {
    this.filter(this.selectedOptions, this.column.name);
    this.filterClose.emit(true);
  }

  get allFilterSelected(): boolean {
    return(this.column.filterValues &&
      this.column.filterValues.length !== 0 &&
      this.selectedOptions &&
      this.selectedOptions.length === this.column.filterValues.length);
  }

  onCheckboxAllClick() {
    if (this.allFilterSelected) {
      this.uncheckAll();
    } else {
      this.checkAll();
    }
  }

}
