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

  searchFilterText: string;
  loading: boolean;
  private selectedOptions: any[] = [];

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
      this.loadFilter();
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
    const index = this.selectedOptions.indexOf(value);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      if (this.column.multiSelectFilter) {
        this.selectedOptions.push(value);
      } else {
        this.selectedOptions = [];
        this.selectedOptions.push(value);
      }
    }
  }

  setSelected(value: any) {
    this.setSelectedOptions(value);
    if (!this.column.multiSelectFilter) {
      this.saveFilter();
      this.filterClose.emit(true);
    }
  }

  checkAll() {
    if (!this.loading) {
      this.selectedOptions = this.column.filterValues.map(option => option.id);
      if (!this.column.multiSelectFilter) {
        this.saveFilter();
        this.filterClose.emit(true);
      }
    }
  }

  onClickClear() {
    if (this.selectedOptions.length > 0) {
      this.selectedOptions = [];
      this.saveFilter();
    }
    this.filterClose.emit(true);
  }

  isSelected(value: any): boolean {
    return this.selectedOptions.indexOf(value) > -1;
  }

  saveFilter() {
    const field = (this.column.keyColumn) ? this.column.keyColumn : this.column.name;
    this.table.dataFilter.setFilter([...this.selectedOptions], field, DataFilter.IN, null, this.column.dataType);
    this.table.events.onFilter();
  }

  loadFilter() {
    const field = (this.column.keyColumn) ? this.column.keyColumn : this.column.name;
    this.selectedOptions = this.table.dataFilter.getFilterValue(field) || [];
  }

  setFocus() {
    if (this.filterInput) {
      setTimeout(() => {
        this.filterInput.nativeElement.focus();
      }, 1);
    }
  }

  onClickOk() {
    this.saveFilter();
    this.filterClose.emit(true);
  }

  onClickCancel() {
    this.selectedOptions = [];
    this.saveFilter();
    this.filterClose.emit(true);
  }

  get allFilterSelected(): boolean {
    return(this.column.filterValues &&
      this.column.filterValues.length !== 0 &&
      this.selectedOptions &&
      this.selectedOptions.length === this.column.filterValues.length);
  }

  get partiallySelected(): boolean {
    return this.selectedOptions.length !== 0 && !this.allFilterSelected;
  }

  onCheckboxAllClick() {
    if (this.allFilterSelected) {
      this.selectedOptions = [];
    } else {
      this.checkAll();
    }
  }

}
