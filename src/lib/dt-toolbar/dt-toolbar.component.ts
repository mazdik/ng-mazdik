import {
  Component, Input, Output, EventEmitter, HostBinding, ElementRef, OnInit, OnDestroy, ViewEncapsulation,
  ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { DataTable } from '../ng-data-table/base';
import { Subscription } from 'rxjs';
import { downloadCSV, Keys } from '../common';

@Component({
  selector: 'dt-toolbar',
  templateUrl: './dt-toolbar.component.html',
  styleUrls: [
    './dt-toolbar.component.css',
    '../styles/input-group.css',
    '../styles/buttons.css',
    '../styles/input.css'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DtToolbarComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Input() createAction: boolean;
  @Input() globalFilter: boolean = true;
  @Input() exportAction: boolean;
  @Input() columnToggleAction: boolean;
  @Input() clearAllFiltersAction: boolean;
  @Input() createMessage: string = 'Create';
  @Input() goMessage: string = 'Go';
  @Input() exportMessage: string = 'Export';
  @Input() searchMessage: string = 'Search...';
  @Input() zIndexColumnToggler: number;

  @Output() create: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.datatable-toolbar') cssClass = true;

  private subscriptions: Subscription[] = [];

  constructor(private element: ElementRef, private cd: ChangeDetectorRef) {
  }

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
    downloadCSV({rows: this.table.rows, keys, titles});
  }

  createActionClick() {
    this.create.emit();
  }

  getHeight() {
    return this.element.nativeElement.offsetHeight;
  }

  clearAllFilters() {
    if (this.table.dataFilter.hasFilters()) {
      this.table.dataFilter.clear();
      this.table.events.onFilter();
    }
  }

}
