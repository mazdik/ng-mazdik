import {
  Component, OnInit, Input, HostBinding, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef,
  ViewChild
} from '@angular/core';
import {DataTable, Column} from '../../base';
import {Subscription} from 'rxjs';
import {HeaderTemplateDirective} from '../../directives/header-template.directive';

@Component({
  selector: 'dt-header',
  templateUrl: 'header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HeaderComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Input() headerTemplate: HeaderTemplateDirective;

  @HostBinding('class.datatable-header') cssClass = true;
  @ViewChild('headerRow', {static: true}) headerRow: ElementRef;

  private subscriptions: Subscription[] = [];
  columnTrackingFn = (i: number, col: Column) => col.name;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    const subColumnResizeEnd = this.table.events.resizeEndSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subScroll = this.table.events.scrollSource$.subscribe((event) => {
      if (!event.direction) {
        const stickyCells = this.headerRow.nativeElement.querySelectorAll('.dt-sticky');
        this.headerRow.nativeElement.style.transform = `translate3d(${this.table.dimensions.offsetX * -1}px, 0, 0)`;
        for (const cell of stickyCells) {
          cell.style.transform = `translate3d(${this.table.dimensions.offsetX}px, 0, 0)`;
        }
        this.cd.markForCheck();
      }
    });
    this.subscriptions.push(subColumnResizeEnd);
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onResizeBegin() {
    this.table.events.onResizeBegin();
  }

  onResize(event: any, column: Column) {
    this.table.events.onResize(event.event);
  }

  onResizeEnd(event, column: Column) {
    column.setWidth(event.width);
    this.table.events.onResizeEnd();
  }

}
