import {
  Component, OnInit, ViewChild, Input, Output, ViewEncapsulation, EventEmitter,
  ChangeDetectionStrategy, DoCheck, KeyValueDiffers, KeyValueDiffer, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import {DataTable} from '../base/data-table';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['../styles/index.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatatableComponent implements OnInit, DoCheck, OnDestroy {

  @Input() public table: DataTable;
  @Input() public loading: boolean;
  @Output() editComplete: EventEmitter<any> = new EventEmitter();
  @Output() selectedRowIndexChanged: EventEmitter<number> = new EventEmitter();

  @ViewChild('selectFilter') selectFilter: any;

  public offsetX: number = 0;

  private rowDiffer: KeyValueDiffer<{}, {}>;
  private subscriptions: Subscription[] = [];

  constructor(private differs: KeyValueDiffers, private cd: ChangeDetectorRef) {
    this.rowDiffer = this.differs.find({}).create();
  }

  ngOnInit() {
    const subSelection = this.table.dataService.selectionSource$.subscribe(() => {
      this.onSelectedRow();
    });
    const subFilter = this.table.dataService.filterSource$.subscribe(() => {
      this.onFilter();
    });
    const subSort = this.table.dataService.sortSource$.subscribe(() => {
      this.onSort();
    });
    const subEdit = this.table.dataService.editSource$.subscribe((row) => {
      this.onEditComplete(row);
    });
    const subColumnMenu = this.table.dataService.columnMenuSource$.subscribe((data) => {
      this.showColumnMenu(data);
    });
    this.subscriptions.push(subSelection);
    this.subscriptions.push(subFilter);
    this.subscriptions.push(subSort);
    this.subscriptions.push(subEdit);
    this.subscriptions.push(subColumnMenu);
  }

  ngDoCheck(): void {
    if (this.rowDiffer.diff(this.table.rows)) {
      this.cd.markForCheck();
      this.table.dataService.onRows();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onPageChanged(page: number): void {
    this.table.pager.current = page;
    this.table.dataService.onPage();

    if (this.table.settings.clientSide) {
      this.table.getLocalRows();
    }
    this.table.selectRow(0);
  }

  onEditComplete(event) {
    this.editComplete.emit(event);
  }

  onFilter() {
    this.table.pager.current = 1;
    if (this.table.settings.clientSide) {
      this.table.getLocalRows();
    }
    this.table.selectRow(0);
  }

  onSort() {
    if (this.table.settings.clientSide) {
      this.table.getLocalRows();
    }
    this.table.selectRow(0);
  }

  onSelectedRow() {
    this.selectedRowIndexChanged.emit(this.table.selectedRowIndex);
  }

  showColumnMenu(event) {
    this.selectFilter.show(event.top, event.left, event.column);
  }

  onBodyScroll(event: MouseEvent): void {
    this.offsetX = event.offsetX;
    this.selectFilter.hide();
  }

}
