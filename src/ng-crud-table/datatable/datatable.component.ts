import {
  Component, OnInit, ViewChild, Input, Output, ViewEncapsulation, EventEmitter,
  ChangeDetectionStrategy, DoCheck, KeyValueDiffers, KeyValueDiffer, ChangeDetectorRef
} from '@angular/core';
import {Filter, SortMeta} from '../types';
import {DataTable} from '../models/data-table';
import {FilterService} from '../services/filter.service';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['../styles/index.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatatableComponent implements OnInit, DoCheck {

  @Input() public table: DataTable;
  @Input() public loading: boolean = false;
  @Input() public selectedRowIndex: number;
  @Input() public trackByProp: string;
  @Output() filterChanged: EventEmitter<Filter> = new EventEmitter();
  @Output() pageChanged: EventEmitter<any> = new EventEmitter();
  @Output() sortChanged: EventEmitter<any> = new EventEmitter();
  @Output() editComplete: EventEmitter<any> = new EventEmitter();
  @Output() selectedRowIndexChanged: EventEmitter<number> = new EventEmitter();

  @Input()
  set rows(val: any) {
    if (this.table.settings.clientSide) {
      this.table.filters = <Filter>{};
      this.table.sortMeta = <SortMeta>{};
      this.rowsCopy = (val) ? val.slice(0) : [];
      this._rows = this.getItems();
    } else {
      this._rows = val;
    }
  }

  get rows(): any {
    return this._rows;
  }

  @ViewChild('selectFilter') selectFilter: any;

  public offsetX: number = 0;
  public rowsCopy: any;

  private rowDiffer: KeyValueDiffer<{}, {}>;
  private _rows: any[];

  constructor(private differs: KeyValueDiffers,
              private cd: ChangeDetectorRef,
              private filterService: FilterService) {
    this.rowDiffer = this.differs.find({}).create();
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    if (this.rowDiffer.diff(this.rows)) {
      this.cd.markForCheck();
    }
  }

  onPageChanged(event: any): void {
    if (this.table.settings.clientSide) {
      this.table.pager.current = event;
      this._rows = this.getItems();
    }
    this.pageChanged.emit(event);
    this.selectRow(0);
  }

  onEditComplete(event) {
    this.editComplete.emit(event);
  }

  onFilter() {
    this.table.pager.current = 1;
    if (this.table.settings.clientSide) {
      this._rows = this.getItems();
    }
    this.filterChanged.emit(this.table.filters);
    this.selectRow(0);
  }

  onSort() {
    if (this.table.settings.clientSide) {
      this._rows = this.getItems();
    }
    this.sortChanged.emit(this.table.sortMeta);
    this.selectRow(0);
  }

  selectRow(rowIndex: number) {
    if (this.rows && this.rows.length) {
      this.selectedRowIndex = rowIndex;
    } else {
      this.selectedRowIndex = undefined;
    }
    this.selectedRowIndexChanged.emit(this.selectedRowIndex);
  }

  onSelectRow(rowIndex: number) {
    this.selectRow(rowIndex);
  }

  showColumnMenu(event) {
    this.selectFilter.show(event.top, event.left, event.column);
  }

  onBodyScroll(event: MouseEvent): void {
    this.offsetX = event.offsetX;
    this.selectFilter.hide();
  }

  getItems() {
    let data = this.filterService.filter(this.rowsCopy, this.table.filters);
    this.table.pager.total = data.length;
    data = this.table.sorter.sort(data, this.table.sortMeta.field, this.table.sortMeta.order);
    data = this.table.pager.pager(data);
    return data;
  }

}
