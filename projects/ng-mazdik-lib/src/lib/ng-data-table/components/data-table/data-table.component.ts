import {
  Component, OnInit, ViewChild, Input, ViewEncapsulation, ElementRef, HostBinding, TemplateRef,
  ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ContentChild
} from '@angular/core';
import {DataTable, ColumnModelGenerator, Row} from '../../base';
import {Subscription} from 'rxjs';
import {BodyComponent} from '../body/body.component';
import {PageEvent} from '../../../pagination/types';
import {HeaderTemplateDirective} from '../../directives/header-template.directive';
import {RowGroupTemplateDirective} from '../../directives/row-group-template.directive';

@Component({
  selector: 'app-datatable, app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: [
    './data-table.component.css',
    '../../../styles/checkbox.css',
    '../../../styles/radio.css',
    '../../../styles/buttons.css',
    '../../../styles/list-menu.css',
    '../../../styles/input.css',
    '../../../styles/spinners.css',
    '../../../styles/icons.css',
    '../../../styles/resizable.css',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;

  @ContentChild(HeaderTemplateDirective, {static: true}) headerTemplate: HeaderTemplateDirective;
  @ContentChild(RowGroupTemplateDirective, {static: true}) rowGroupTemplate: RowGroupTemplateDirective;

  @ViewChild('resizeHelper', {static: true}) resizeHelper: ElementRef;
  @ViewChild('footer', {static: true}) footerViewChild: ElementRef;
  @ViewChild(BodyComponent, {static: false}) body: BodyComponent;
  @ViewChild('rowCheckboxTemplate', {static: true}) rowCheckboxTemplate: TemplateRef<any>;
  @ViewChild('headerCheckboxTemplate', {static: true}) headerCheckboxTemplate: TemplateRef<any>;

  @HostBinding('class.datatable') cssClass = true;
  @HostBinding('attr.role') role = 'grid';

  @HostBinding('class.fixed-header')
  get isFixedHeader(): boolean {
    return (this.table.dimensions.headerRowHeight) ? true : false;
  }

  loading: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private element: ElementRef, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    const actionColumn = this.table.columns.find(x => x.name === ColumnModelGenerator.checkboxColumn.name);
    if (actionColumn) {
      actionColumn.cellTemplate = this.rowCheckboxTemplate;
      actionColumn.headerCellTemplate = this.headerCheckboxTemplate;
    }

    const subFilter = this.table.events.filterSource$.subscribe(() => {
      this.onFilter();
    });
    const subSort = this.table.events.sortSource$.subscribe(() => {
      this.onSort();
    });
    const subColumnResizeBegin = this.table.events.resizeBeginSource$.subscribe(() => {
      this.onColumnResizeBegin();
    });
    const subColumnResize = this.table.events.resizeSource$.subscribe((event) => {
      this.onColumnResize(event);
    });
    const subColumnResizeEnd = this.table.events.resizeEndSource$.subscribe(() => {
      this.onColumnResizeEnd();
    });
    const subScroll = this.table.events.scrollSource$.subscribe(() => {
      requestAnimationFrame(() => this.cd.detectChanges());
    });
    const subLoading = this.table.events.loadingSource$.subscribe((event) => {
      this.loading = event;
      this.cd.markForCheck();
      // for server-side virtual scroll
      if (this.table.settings.virtualScroll) {
        requestAnimationFrame(() => this.cd.detectChanges());
      }
    });
    this.subscriptions.push(subFilter);
    this.subscriptions.push(subSort);
    this.subscriptions.push(subColumnResizeBegin);
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
      if (this.table.clientSide) {
        this.table.loadLocalRows();
      }
    }
    this.table.selection.clearSelection();
  }

  onFilter() {
    this.table.pager.current = 1;
    if (this.table.clientSide) {
      this.table.loadLocalRows();
    }
    this.table.selection.clearSelection();
  }

  onSort() {
    if (this.table.clientSide) {
      this.table.loadLocalRows();
    }
    this.table.selection.clearSelection();
  }

  onColumnResizeBegin() {
    this.element.nativeElement.classList.add('datatable-unselectable');
    const height = this.element.nativeElement.offsetHeight - this.footerViewChild.nativeElement.offsetHeight;
    this.resizeHelper.nativeElement.style.height = height + 'px';
  }

  onColumnResize(event) {
    const rect = this.element.nativeElement.getBoundingClientRect();
    const containerLeft = rect.left + document.body.scrollLeft;
    this.resizeHelper.nativeElement.style.left = (event.pageX - containerLeft + this.element.nativeElement.scrollLeft) + 'px';
    this.resizeHelper.nativeElement.style.display = 'block';
  }

  onColumnResizeEnd() {
    this.resizeHelper.nativeElement.style.display = 'none';
    this.element.nativeElement.classList.remove('datatable-unselectable');
    this.table.dimensions.recalcColumns();
  }

  get headerVisible(): boolean {
    return this.table.dimensions.headerRowHeight === 0 ? false : true;
  }

  onCheckboxClick(row: Row) {
    this.table.selection.toggle(row.$$index);
    this.table.events.onCheckbox(row);
  }

}
