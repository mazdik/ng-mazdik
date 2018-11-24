import {
  Component, OnInit, ViewChild, Input, Output, ViewEncapsulation, EventEmitter, ElementRef, HostBinding,
  ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import {DataTable, ColumnResizeMode} from '../../base';
import {Subscription} from 'rxjs';
import {BodyComponent} from '../body/body.component';
import {HeaderComponent} from '../header/header.component';
import {PageEvent} from '../../../lib/pagination';

@Component({
  selector: 'app-datatable, app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: [
    './data-table.component.css',
    '../../../lib/styles/checkbox.css',
    '../../../lib/styles/radio.css',
    '../../../lib/styles/buttons.css',
    '../../../lib/styles/list-menu.css',
    '../../../lib/styles/input.css',
    '../../../lib/styles/spinners.css',
    '../../../lib/styles/icons.css',
    '../../../lib/styles/resizable.css',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('resizeHelper') resizeHelper: ElementRef;
  @ViewChild('footer') footerViewChild: ElementRef;
  @ViewChild(BodyComponent) body: BodyComponent;
  @ViewChild(HeaderComponent) header: HeaderComponent;

  @HostBinding('class.datatable') cssClass = true;
  @HostBinding('attr.role') role = 'grid';

  @HostBinding('class.fixed-header')
  get isFixedHeader(): boolean {
    return (this.table.dimensions.headerRowHeight) ? true : false;
  }

  @HostBinding('style.width.px')
  get tableWidth() {
    return this.table.dimensions.tableWidth;
  }

  loading: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private element: ElementRef, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    const subSelection = this.table.events.selectionSource$.subscribe(() => {
      this.onSelectedRow();
    });
    const subFilter = this.table.events.filterSource$.subscribe(() => {
      this.onFilter();
    });
    const subSort = this.table.events.sortSource$.subscribe(() => {
      this.onSort();
    });
    const subColumnBeginResize = this.table.events.resizeBeginSource$.subscribe(() => {
      this.onColumnResizeBegin();
    });
    const subColumnResize = this.table.events.resizeSource$.subscribe((event) => {
      this.onColumnResize(event);
    });
    const subColumnResizeEnd = this.table.events.resizeEndSource$.subscribe(() => {
      this.onColumnResizeEnd();
    });
    const subScroll = this.table.events.scrollSource$.subscribe(() => {
      requestAnimationFrame(() => {
        this.cd.detectChanges();
      });
    });
    const subLoading = this.table.events.loadingSource$.subscribe((event) => {
      this.loading = event;
      this.cd.markForCheck();
      // for server-side virtual scroll
      if (this.table.settings.virtualScroll) {
        requestAnimationFrame(() => {
          this.cd.detectChanges();
        });
      }
    });
    this.subscriptions.push(subSelection);
    this.subscriptions.push(subFilter);
    this.subscriptions.push(subSort);
    this.subscriptions.push(subColumnBeginResize);
    this.subscriptions.push(subColumnResize);
    this.subscriptions.push(subColumnResizeEnd);
    this.subscriptions.push(subScroll);
    this.subscriptions.push(subLoading);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onPageChanged(event: PageEvent): void {
    this.table.pager.current = event.currentPage;
    this.table.pager.perPage = event.perPage;
    this.table.events.onPage();
    if (this.table.settings.virtualScroll) {
      this.body.scroller.setPageOffsetY(event.currentPage);
    } else {
      if (this.table.settings.clientSide) {
        this.table.getLocalRows();
      }
    }
    this.table.selection.clearSelection();
  }

  onFilter() {
    this.table.pager.current = 1;
    if (this.table.settings.clientSide) {
      this.table.getLocalRows();
    }
    this.table.selection.clearSelection();
  }

  onSort() {
    if (this.table.settings.clientSide) {
      this.table.getLocalRows();
    }
    this.table.selection.clearSelection();
  }

  onSelectedRow() {
    this.selectionChange.emit(this.table.selection.getSelection());
  }

  onColumnResizeBegin() {
    this.element.nativeElement.classList.add('datatable-unselectable');
    const height = this.element.nativeElement.offsetHeight - this.footerViewChild.nativeElement.offsetHeight;
    this.resizeHelper.nativeElement.style.height = height + 'px';
  }

  onColumnResize(event) {
    if (this.table.settings.columnResizeMode === ColumnResizeMode.Simple) {
      const rect = this.element.nativeElement.getBoundingClientRect();
      const containerLeft = rect.left + document.body.scrollLeft;
      this.resizeHelper.nativeElement.style.left = (event.pageX - containerLeft + this.element.nativeElement.scrollLeft) + 'px';
      this.resizeHelper.nativeElement.style.display = 'block';
    }
  }

  onColumnResizeEnd() {
    this.resizeHelper.nativeElement.style.display = 'none';
    this.element.nativeElement.classList.remove('datatable-unselectable');
    this.table.dimensions.calcColumnsTotalWidth(this.table.columns);
  }

  get headerVisible(): boolean {
    if (this.table.dimensions.headerRowHeight === 0) {
      return false;
    }
    return true;
  }

}
