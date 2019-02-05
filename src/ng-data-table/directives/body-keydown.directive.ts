import { Directive, Input, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DataTable, KeyboardAction, EventHelper } from '../base';

@Directive({
  selector: '[appBodyKeydown]'
})
export class BodyKeydownDirective implements OnInit, OnDestroy {

  @Input() table: DataTable;

  element: HTMLElement;
  private keyboardAction: KeyboardAction;
  private keydownListener: any;

  constructor(element: ElementRef, private ngZone: NgZone) {
    this.element = element.nativeElement;
  }

  ngOnInit(): void {
    this.keyboardAction = new KeyboardAction(this.table);
    this.ngZone.runOutsideAngular(() => {
      this.keydownListener = this.onKeydown.bind(this);
      this.element.addEventListener('keydown', this.keydownListener);
    });
  }

  ngOnDestroy(): void {
    this.element.removeEventListener('keydown', this.keydownListener);
  }

  onKeydown(event: any): void {
    const target = EventHelper.findCellEventTarget(event, this.element);
    if (target) {
      this.ngZone.run(() => {
        this.keyboardAction.handleEvent(event, target);
      });
    }
  }

}
