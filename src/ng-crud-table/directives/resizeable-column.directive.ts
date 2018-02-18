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
  newWidth: number;

  constructor(element: ElementRef, private renderer: Renderer2) {
    this.element = element.nativeElement;
  }

  ngAfterViewInit(): void {
    if (this.column.resizeable) {
      const node = this.renderer.createElement('span');
      this.renderer.addClass(node, 'resize-handle');
      this.renderer.appendChild(this.element, node);
    }
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
      this.column.setWidth(this.newWidth);
      this.table.dataService.onResizeEnd();
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
    this.newWidth = initialWidth + movementX;

    const overMinWidth = !this.column.minWidth || this.newWidth >= this.column.minWidth;
    const underMaxWidth = !this.column.maxWidth || this.newWidth <= this.column.maxWidth;

    if (overMinWidth && underMaxWidth) {
      if (this.table.settings.setWidthColumnOnMove) {
        this.element.style.width = `${this.newWidth}px`;
        this.column.setWidth(this.newWidth);
      }
      this.table.dataService.onResize(event);
    }
  }

  private _destroySubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

}
