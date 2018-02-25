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
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('resizeHelper') resizeHelper: ElementRef;
  @ViewChild('container') containerViewChild: ElementRef;
  @ViewChild('footer') footerViewChild: ElementRef;

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
    const subColumnBeginResize = this.table.dataService.resizeBeginSource$.subscribe(() => {
      this.onColumnResizeBegin();
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
    this.subscriptions.push(subColumnBeginResize);
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
    this.selectionChange.emit(this.table.dataSelection.getSelection());
  }

  onColumnResizeBegin() {
    this.containerViewChild.nativeElement.classList.add('datatable-unselectable');
    const height = this.containerViewChild.nativeElement.offsetHeight - this.footerViewChild.nativeElement.offsetHeight;
    this.resizeHelper.nativeElement.style.height = height + 'px';
  }

  onColumnResize(event) {
    if (!this.table.settings.setWidthColumnOnMove) {
      const rect = this.containerViewChild.nativeElement.getBoundingClientRect();
      const containerLeft = rect.left + document.body.scrollLeft;
      this.resizeHelper.nativeElement.style.left = (event.pageX - containerLeft + this.containerViewChild.nativeElement.scrollLeft) + 'px';
      this.resizeHelper.nativeElement.style.display = 'block';
    }
  }

  onColumnResizeEnd() {
    this.resizeHelper.nativeElement.style.display = 'none';
    this.containerViewChild.nativeElement.classList.remove('datatable-unselectable');
  }

}
