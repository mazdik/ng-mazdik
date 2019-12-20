import {
  Component, Input, Output, EventEmitter, HostBinding, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { DataTable, Row, Column } from '../ng-data-table/base';
import { Subscription } from 'rxjs';
import { downloadCSV, Keys } from '../common';

@Component({
  selector: 'dt-toolbar',
  templateUrl: './dt-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtToolbarComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Input() createAction: boolean;
  @Input() globalFilter: boolean = true;
  @Input() exportAction: boolean;
  @Input() columnToggleAction: boolean;
  @Input() clearAllFiltersAction: boolean;

  @Output() create: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.dt-toolbar') cssClass = true;

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    const subFilter = this.table.events.filterSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subFilter);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onClickGlobalSearch() {
    this.table.events.onFilter();
  }

  onKeyPressGlobalSearch(event: KeyboardEvent) {
    if (event.which === Keys.ENTER) {
      this.table.events.onFilter();
    }
  }

  downloadCsv() {
    const keys = this.table.columns.map(col => col.name);
    const titles = this.table.columns.map(col => col.title);

    const resultRows = [];
    this.table.rows.forEach((x: Row) => {
      const row = x.clone();
      this.table.columns.forEach((col: Column) => {
        row[col.name] = col.getValueView(row);
      });
      resultRows.push(row);
    });

    downloadCSV({rows: resultRows, keys, titles});
  }

  createActionClick() {
    this.create.emit();
  }

  clearAllFilters() {
    if (this.table.dataFilter.hasFilters()) {
      this.table.dataFilter.clear();
      this.table.events.onFilter();
    }
  }

}
