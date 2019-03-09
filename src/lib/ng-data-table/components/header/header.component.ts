import {
  Component, OnInit, Input, HostBinding, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef,
  ViewChild, ViewContainerRef, AfterViewInit
} from '@angular/core';
import {DataTable, ColumnResizeMode, Column} from '../../base';
import {Subscription} from 'rxjs';
import {HeaderTemplateDirective} from '../../directives/header-template.directive';

@Component({
  selector: 'dt-header',
  templateUrl: 'header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() table: DataTable;
  @Input() headerTemplate: HeaderTemplateDirective;

  @HostBinding('class.datatable-header') cssClass = true;
  @ViewChild('headerTemplateView', { read: ViewContainerRef }) headerTemplateView: ViewContainerRef;
  @ViewChild('rowCenter') rowCenter: ElementRef;

  columnTrackingFn = (i: number, col: Column) => col.name;
  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef, private element: ElementRef) {}

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
      this.rowCenter.nativeElement.style.transform = `translate3d(${this.table.dimensions.offsetX * -1}px, 0, 0)`;
      this.cd.markForCheck();
    });
    this.subscriptions.push(subColumnResizeEnd);
    this.subscriptions.push(subScroll);
  }

  ngAfterViewInit() {
    if (this.headerTemplate && this.headerTemplate.template) {
      this.table.dimensions.headerTemplateHeight = this.headerTemplateView.element.nativeElement.nextSibling.offsetHeight;
    }
  }

  ngOnDestroy() {
    if (this.headerTemplateView) {
      this.headerTemplateView.clear();
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
