import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  ViewEncapsulation,
  AfterViewInit,
  OnDestroy,
  EventEmitter
} from '@angular/core';
import {Column, Filter, Settings, SortMeta, MenuItem} from '../types/interfaces';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DatatableComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() public columns: Column[];
  @Input() public settings: Settings;
  @Input() public headerHeight: number = 30;
  @Input() public items: any;
  @Input() public rowMenu: MenuItem[];
  @Input() public itemsPerPage: number = 10;
  @Input() public totalItems: number = 0;
  @Input() public loading: boolean = false;
  @Output() filterChanged: EventEmitter<Filter> = new EventEmitter();
  @Output() pageChanged: EventEmitter<any> = new EventEmitter();
  @Output() sortChanged: EventEmitter<any> = new EventEmitter();
  @Output() editComplete: EventEmitter<any> = new EventEmitter();

  @Input()
  set filters(val: any) {
    this._filters = val;
    this.filterChanged.emit(this._filters);
  }

  get filters(): any {
    return this._filters;
  }

  @ViewChild('selectFilter') selectFilter: any;
  _filters: Filter = {};

  public selectedRowIndex: number;
  public sortMeta: SortMeta = <SortMeta>{};

  public scrollHeight: number;
  public tableWidth: number;
  public letterWidth: number = 10;
  public actionColumnWidth: number = 40;

  frozenColumns: Column[];
  scrollableColumns: Column[];
  frozenWidth: number = 0;
  scrollableColumnsWidth: number = 0;
  offsetX: number = 0;

  constructor() {
  }

  ngOnInit() {
    this.initColumns();
    this.initTableSize();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  initColumns(): void {
    this.settings.sortable = (this.settings.hasOwnProperty('sortable')) ? this.settings.sortable : true;
    this.settings.filter = (this.settings.hasOwnProperty('filter')) ? this.settings.filter : true;
    this.settings.initLoad = (this.settings.initLoad !== undefined) ? this.settings.initLoad : true;

    this.letterWidth = this.getTextWidth('M', 'bold 14px arial');
    this.setColumnsDefaults(this.columns);

    this.scrollableColumns = [];
    this.columns.forEach((column) => {
      if (column.frozen) {
        this.frozenColumns = this.frozenColumns || [];
        this.frozenColumns.push(column);
        this.frozenWidth = this.frozenWidth + column.width;
      } else {
        this.scrollableColumns.push(column);
        this.scrollableColumnsWidth = this.scrollableColumnsWidth + column.width;
      }
    });
  }

  initTableSize() {
    this.tableWidth = this.settings.tableWidth || this.columnsTotalWidth(this.columns);
    this.scrollHeight = this.settings.scrollHeight;
  }

  onPageChanged(event: any): void {
    this.pageChanged.emit(event);
  }

  onEditComplete(event) {
    this.editComplete.emit(event);
  }

  onFilter(event) {
    this.filters = event;
  }

  onSort(event) {
    this.sortMeta = event.sortMeta;
    this.sortChanged.emit(this.sortMeta);
  }

  showColumnMenu(event) {
    this.selectFilter.show(200, event.top, event.left, event.column);
  }

  setColumnDefaults(column: Column): Column {
    if (!column.hasOwnProperty('sortable') && this.settings.sortable) {
      column.sortable = true;
    }
    if (!column.hasOwnProperty('filter') && this.settings.filter) {
      column.filter = true;
    }
    if (!column.hasOwnProperty('width')) {
      column.width = (column.name.length * this.letterWidth) + 50;
      if (column.width < 150) {
        column.width = 150;
      }
    }
    if (!column.hasOwnProperty('frozen')) {
      column.frozen = false;
    }
    if (!column.hasOwnProperty('type')) {
      column.type = 'text';
    }
    if (!column.hasOwnProperty('resizeable')) {
      column.resizeable = true;
    }
    return column;
  }

  setColumnsDefaults(columns: Column[]): Column[] {
    if (!columns) {
      return;
    }
    const result = columns.map(this.setColumnDefaults, this);
    return result;
  }

  columnsTotalWidth(columns: Column[]): number {
    let totalWidth = 0;
    for (const column of columns) {
      totalWidth = totalWidth + column.width;
    }
    return totalWidth + this.actionColumnWidth;
  }

  getTextWidth(text, font) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  resizeColumn({column, newValue}: any) {
    for (const col of this.columns) {
      if (col.name === column.name) {
        col.width = newValue;
      }
    }
  }

  onBodyScroll(event: MouseEvent): void {
    this.offsetX = event.offsetX;
    this.selectFilter.hide();
  }

  setColumnSelectedOption(value, field, matchMode) {
    this.selectFilter.setColumnSelectedOption(value, field, null);
  }

  filter(data: any, filters: Filter) {
    let filteredData: Array<any> = data;
    for (const key in filters) {
      if (filters[key]['value']) {
        filteredData = filteredData.filter((item: any) => {
          if (item[key]) {
            return item[key].toString().match(filters[key]['value']);
          } else {
            return false;
          }
        });
      }
    }
    return filteredData;
  }

  sort(data: any, sortField ?: string, sortOrder ?: number) {
    return data.sort((previous: any, current: any) => {
      if (previous[sortField] > current[sortField]) {
        return sortOrder === -1 ? -1 : 1;
      } else if (previous[sortField] < current[sortField]) {
        return sortOrder === 1 ? -1 : 1;
      }
      return 0;
    });
  }

  page(data: any, page: any): Array<any> {
    const start = (page - 1) * this.itemsPerPage;
    const end = this.itemsPerPage > -1 ? (start + this.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

}
