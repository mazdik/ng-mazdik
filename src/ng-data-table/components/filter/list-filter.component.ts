import {
  Component, OnChanges, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {Column, DataTable, DataFilter} from '../../base';

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

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnChanges() {
    if (this.isOpen) {
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

  saveFilter() {
    const field = (this.column.keyColumn) ? this.column.keyColumn : this.column.name;
    this.table.dataFilter.setFilter([...this.selectedOptions], field, DataFilter.IN, null, this.column.dataType);
    this.table.events.onFilter();
  }

  loadFilter() {
    const field = (this.column.keyColumn) ? this.column.keyColumn : this.column.name;
    this.selectedOptions = this.table.dataFilter.getFilterValue(field) || [];
  }

  onSelectionChange(event) {
    this.selectedOptions = event;
    this.saveFilter();
    this.filterClose.emit(true);
  }

  onSelectionCancel() {
    this.filterClose.emit(true);
  }

}
