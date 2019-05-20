import { Directive, Input, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DataTable, EventHelper } from '../base';

@Directive({
  selector: '[appBodyDblClick]'
})
export class BodyDblClickDirective implements OnInit, OnDestroy {

  @Input() table: DataTable;

  element: HTMLElement;
  private clickListener: any;

  constructor(element: ElementRef, private ngZone: NgZone) {
    this.element = element.nativeElement;
  }

  ngOnInit(): void {
    const editable = this.table.columns.some(x => x.editable);
    if (editable) {
      this.ngZone.runOutsideAngular(() => {
        this.clickListener = this.onDblClick.bind(this);
        this.element.addEventListener('dblclick', this.clickListener);
      });
    }
  }

  ngOnDestroy(): void {
    this.element.removeEventListener('dblclick', this.clickListener);
  }

  onDblClick(event: any): void {
    const cellEventArgs = EventHelper.findCellEvent(event, this.element);
    if (cellEventArgs) {
      this.ngZone.run(() => {
        this.table.events.onDblClickCell(cellEventArgs);
      });
    }
  }

}
