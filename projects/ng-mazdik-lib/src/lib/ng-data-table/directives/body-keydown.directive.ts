import { Directive, Input, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DataTable, KeyboardAction } from '../base';

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
    this.keyboardAction = new KeyboardAction(this.table.events, this.table.selection);
    this.ngZone.runOutsideAngular(() => {
      this.keydownListener = this.onKeydown.bind(this);
      this.element.addEventListener('keydown', this.keydownListener);
    });
  }

  ngOnDestroy(): void {
    this.element.removeEventListener('keydown', this.keydownListener);
  }

  onKeydown(event: any): void {
    const maxColIndex = this.table.columns.length;
    const maxRowIndex = this.table.rows.length;
    this.ngZone.run(() => {
      this.keyboardAction.handleEvent(event, this.element, maxColIndex, maxRowIndex);
    });
  }

}
