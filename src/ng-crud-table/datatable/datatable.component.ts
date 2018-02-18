import {
  Component, OnInit, ViewChild, Input, Output, ViewEncapsulation, EventEmitter, ElementRef,
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
  @ViewChild('resizeHelper') resizeHelper: ElementRef;
  @ViewChild('container') containerViewChild: ElementRef;
  @ViewChild('footer') footerViewChild: ElementRef;

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
    const subColumnResize = this.table.dataService.resizeSource$.subscribe((event) => {
      this.onColumnResize(event);
    });
    const subColumnResizeEnd = this.table.dataService.resizeEndSource$.subscribe(() => {
      this.onColumnResizeEnd();
    });
    this.subscriptions.push(subSelection);
    this.subscriptions.push(subFilter);
    this.subscriptions.push(subSort);
    this.subscriptions.push(subEdit);
    this.subscriptions.push(subColumnMenu);
    this.subscriptions.push(subColumnResize);
    this.subscriptions.push(subColumnResizeEnd);
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

  onColumnResize(event) {
    if (!this.table.settings.setWidthColumnOnMove) {
      const rect = this.containerViewChild.nativeElement.getBoundingClientRect();
      const containerLeft = rect.left + document.body.scrollLeft;
      const height = this.containerViewChild.nativeElement.offsetHeight - this.footerViewChild.nativeElement.offsetHeight;
      this.resizeHelper.nativeElement.style.height = height + 'px';
      this.resizeHelper.nativeElement.style.top = 0 + 'px';
      this.resizeHelper.nativeElement.style.left = (event.pageX - containerLeft + this.containerViewChild.nativeElement.scrollLeft) + 'px';
      this.resizeHelper.nativeElement.style.display = 'block';
    }
  }

  onColumnResizeEnd() {
    this.resizeHelper.nativeElement.style.display = 'none';
  }

}
