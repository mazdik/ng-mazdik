import {
  Directive, ElementRef, HostListener, Input, OnDestroy, AfterViewInit, Renderer2, HostBinding
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {takeUntil} from 'rxjs/operators';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {DataTable} from '../base/data-table';
import {Column} from '../base/column';

@Directive({
  selector: '[appResizeableColumn]'
})
export class ResizeableColumnDirective implements OnDestroy, AfterViewInit {

  @Input() public table: DataTable;
  @Input() public column: Column;

  element: HTMLElement;
  subscription: Subscription;
  resizing: boolean;

  constructor(element: ElementRef, private renderer: Renderer2) {
    this.element = element.nativeElement;
  }

  ngAfterViewInit(): void {
    const renderer2 = this.renderer;
    const node = renderer2.createElement('span');
    if (this.column.resizeable) {
      renderer2.addClass(node, 'resize-handle');
    } else {
      renderer2.addClass(node, 'resize-handle--not-resizable');
    }
    renderer2.appendChild(this.element, node);
  }

  ngOnDestroy(): void {
    this._destroySubscription();
  }

  @HostBinding('class.resizeable')
  get cssClass() {
    return this.column.resizeable ? 'resizeable' : '';
  }

  onMouseup(): void {
    this.resizing = false;

    if (this.subscription && !this.subscription.closed) {
      this._destroySubscription();
      this.column.setWidth(this.element.clientWidth);
      this.table.dataService.onResize();
    }
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent): void {
    const isHandle = (<HTMLElement>(event.target)).classList.contains('resize-handle');
    const initialWidth = this.element.clientWidth;
    const mouseDownScreenX = event.screenX;

    if (isHandle) {
      event.stopPropagation();
      this.resizing = true;

      const mouseup = fromEvent(document, 'mouseup');
      this.subscription = mouseup
        .subscribe((ev: MouseEvent) => this.onMouseup());

      const mouseMoveSub = fromEvent(document, 'mousemove')
        .pipe(takeUntil(mouseup))
        .subscribe((e: MouseEvent) => this.move(e, initialWidth, mouseDownScreenX));

      this.subscription.add(mouseMoveSub);
    }
  }

  move(event: MouseEvent, initialWidth: number, mouseDownScreenX: number): void {
    const movementX = event.screenX - mouseDownScreenX;
    const newWidth = initialWidth + movementX;

    const overMinWidth = !this.column.minWidth || newWidth >= this.column.minWidth;
    const underMaxWidth = !this.column.maxWidth || newWidth <= this.column.maxWidth;

    if (overMinWidth && underMaxWidth) {
      this.element.style.width = `${newWidth}px`;
    }
  }

  private _destroySubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

}
