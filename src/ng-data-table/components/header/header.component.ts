import {
  Component, OnInit, Input, HostBinding, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef,
  ViewChild, ViewContainerRef, AfterViewInit
} from '@angular/core';
import {DataTable, ColumnResizeMode, Column} from '../../base';
import {translate} from '../../base/util';
import {Subscription} from 'rxjs';

@Component({
  selector: 'dt-header',
  templateUrl: 'header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() table: DataTable;

  @HostBinding('class') cssClass = 'datatable-header';
  @ViewChild('headerTemplate', { read: ViewContainerRef }) headerTemplate: ViewContainerRef;
  @ViewChild('rowCenter') rowCenter: ElementRef;

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef, private element: ElementRef) {
  }

  ngOnInit() {
    if (this.table.settings.columnResizeMode === ColumnResizeMode.Aminated) {
      const subColumnResize = this.table.events.resizeSource$.subscribe(() => {
        this.cd.markForCheck();
      });
      this.subscriptions.push(subColumnResize);
    }
    const subColumnResizeEnd = this.table.events.resizeEndSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subScroll = this.table.events.scrollSource$.subscribe(() => {
      this.rowCenter.nativeElement.style.transform = translate(this.table.dimensions.offsetX * -1, 0);
      this.cd.markForCheck();
    });
    this.subscriptions.push(subColumnResizeEnd);
    this.subscriptions.push(subScroll);
  }

  ngAfterViewInit() {
    if (this.headerTemplate) {
      this.table.dimensions.headerTemplateHeight = this.headerTemplate.element.nativeElement.nextSibling.offsetHeight;
    }
  }

  ngOnDestroy() {
    if (this.headerTemplate) {
      this.headerTemplate.clear();
    }
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getHeight() {
    if (this.element.nativeElement) {
      return this.element.nativeElement.offsetHeight;
    }
  }

  onResizeBegin() {
    this.table.events.onResizeBegin();
  }

  onResize(event: any, column: Column) {
    if (!this.isGhostResize) {
      column.setWidth(event.width);
    }
    this.table.events.onResize(event.event);
  }

  onResizeEnd(event, column: Column) {
    column.setWidth(event.width);
    this.table.events.onResizeEnd();
  }

  get isGhostResize(): boolean {
    return (this.table.settings.columnResizeMode !== ColumnResizeMode.Aminated);
  }

}
