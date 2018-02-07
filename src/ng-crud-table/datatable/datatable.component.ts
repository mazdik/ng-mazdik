import {
  Component, OnInit, ViewChild, Input, Output, ViewEncapsulation, EventEmitter,
  ChangeDetectionStrategy, DoCheck, KeyValueDiffers, KeyValueDiffer, ChangeDetectorRef
} from '@angular/core';
import {DataTable} from '../models/data-table';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['../styles/index.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatatableComponent implements OnInit, DoCheck {

  @Input() public table: DataTable;
  @Input() public loading: boolean;
  @Output() filterChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() pageChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() sortChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() editComplete: EventEmitter<any> = new EventEmitter();
  @Output() selectedRowIndexChanged: EventEmitter<number> = new EventEmitter();

  @Input()
  set rows(val: any) {
    if (this.table.settings.clientSide) {
      this.table.setLocalRows(val);
      this._rows = this.table.getLocalRows();
    } else {
      this._rows = val;
    }
  }

  get rows(): any {
    return this._rows;
  }

  @ViewChild('selectFilter') selectFilter: any;

  public offsetX: number = 0;

  private rowDiffer: KeyValueDiffer<{}, {}>;
  private _rows: any[];

  constructor(private differs: KeyValueDiffers, private cd: ChangeDetectorRef) {
    this.rowDiffer = this.differs.find({}).create();
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    if (this.rowDiffer.diff(this.rows)) {
      this.cd.markForCheck();
    }
  }

  onPageChanged(): void {
    if (this.table.settings.clientSide) {
      this._rows = this.table.getLocalRows();
    }
    this.pageChanged.emit(true);
    this.selectRow(0);
  }

  onEditComplete(event) {
    this.editComplete.emit(event);
  }

  onFilter() {
    this.table.pager.current = 1;
    if (this.table.settings.clientSide) {
      this._rows = this.table.getLocalRows();
    }
    this.filterChanged.emit(true);
    this.selectRow(0);
  }

  onSort() {
    if (this.table.settings.clientSide) {
      this._rows = this.table.getLocalRows();
    }
    this.sortChanged.emit(true);
    this.selectRow(0);
  }

  selectRow(rowIndex: number) {
    if (this.rows && this.rows.length) {
      this.table.selectedRowIndex = rowIndex;
    } else {
      this.table.selectedRowIndex = undefined;
    }
    this.selectedRowIndexChanged.emit(this.table.selectedRowIndex);
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

}
