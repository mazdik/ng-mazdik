import {
  Component, OnChanges, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {Column, DataTable, FilterOperator} from '../../base';

@Component({
  selector: 'app-list-filter',
  templateUrl: 'list-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListFilterComponent implements OnChanges {

  @Input() table: DataTable;
  @Input() column: Column;
  @Input() isOpen: boolean;
  @Output() filterClose: EventEmitter<boolean> = new EventEmitter();

  loading: boolean;
  selectedOptions: any[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges() {
    if (this.isOpen) {
      this.loadFilter();
      this.loading = true;
      this.column.getFilterValues().then((res) => {
          this.column.filterValuesTemp = res;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
          this.cd.markForCheck();
        });
    }
  }

  saveFilter(value) {
    const field = (this.column.keyColumn) ? this.column.keyColumn : this.column.name;
    this.table.dataFilter.setFilter([...value], field, FilterOperator.IN, null, this.column.dataType);
    this.table.events.onFilter();
  }

  loadFilter() {
    const field = (this.column.keyColumn) ? this.column.keyColumn : this.column.name;
    this.selectedOptions = this.table.dataFilter.getFilterValue(field) || [];
  }

  onSelectionChange(event) {
    this.saveFilter(event);
    this.filterClose.emit(true);
  }

  onSelectionCancel() {
    this.filterClose.emit(true);
  }

}
