import { Directive, Input, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DataTable, EventHelper } from '../base';

@Directive({
  selector: '[appBodyMouseover]'
})
export class BodyMouseoverDirective implements OnInit, OnDestroy {

  @Input() table: DataTable;

  element: HTMLElement;
  currentElem: any;
  private mouseoverListener: any;
  private mouseoutListener: any;

  constructor(element: ElementRef, private ngZone: NgZone) {
    this.element = element.nativeElement;
  }

  ngOnInit(): void {
    if (this.table.settings.hoverEvents) {
      this.ngZone.runOutsideAngular(() => {
        this.mouseoverListener = this.onMouseover.bind(this);
        this.mouseoutListener = this.onMouseout.bind(this);
        this.element.addEventListener('mouseover', this.mouseoverListener);
        this.element.addEventListener('mouseout', this.mouseoutListener);
      });
    }
  }

  ngOnDestroy(): void {
    this.element.removeEventListener('mouseover', this.mouseoverListener);
    this.element.removeEventListener('mouseout', this.mouseoutListener);
  }

  onMouseover(event: any): void {
    if (this.currentElem) {
      return;
    }
    const target = EventHelper.findCellEventTarget(event, this.element);
    if (!target) { return; }
    this.currentElem = target;

    const cellEventArgs = EventHelper.findCellEvent(event, this.element);
    if (cellEventArgs) {
      this.table.events.onMouseover(cellEventArgs);
    }
  }

  onMouseout(event: any): void {
    if (!this.currentElem) {
      return;
    }
    let relatedTarget = event.relatedTarget;
    if (relatedTarget) {
      while (relatedTarget) {
        if (relatedTarget === this.currentElem) {
          return;
        }
        relatedTarget = relatedTarget.parentNode;
      }
    }
    this.currentElem = null;
    const cellEventArgs = EventHelper.findCellEvent(event, this.element);
    if (cellEventArgs) {
      this.table.events.onMouseout(cellEventArgs);
    }
  }

}
