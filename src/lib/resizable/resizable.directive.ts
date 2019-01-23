import {
  Directive, ElementRef, HostListener, Input, Output, EventEmitter, OnDestroy, AfterViewInit, Renderer2, NgZone
} from '@angular/core';
import {Subscription, fromEvent, merge} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export interface ResizableEvent {
  width: number;
  height: number;
  event?: any;
  direction?: 'horizontal' | 'vertical';
}

@Directive({
  selector: '[appResizable]'
})
export class ResizableDirective implements OnDestroy, AfterViewInit {

  @Input() south: boolean;
  @Input() east: boolean;
  @Input() southEast: boolean;
  @Input() minWidth: number;
  @Input() maxWidth: number;
  @Input() ghost: boolean;
  @Input() minHeight: number;
  @Input() maxHeight: number;

  @Output() resizeBegin: EventEmitter<any> = new EventEmitter();
  @Output() resize: EventEmitter<ResizableEvent> = new EventEmitter();
  @Output() resizeEnd: EventEmitter<ResizableEvent> = new EventEmitter();

  element: HTMLElement;
  private subscription: Subscription;
  private newWidth: number;
  private newHeight: number;
  private resizingS: boolean; // south
  private resizingE: boolean; // east
  private resizingSE: boolean; // south-east

  constructor(element: ElementRef, private renderer: Renderer2, private ngZone: NgZone) {
    this.element = element.nativeElement;
  }

  ngAfterViewInit(): void {
    if (this.south) {
      this.createHandle('resize-handle-s');
    }
    if (this.east) {
      this.createHandle('resize-handle-e');
    }
    if (this.southEast) {
      this.createHandle('resize-handle-se');
    }
  }

  ngOnDestroy(): void {
    this.destroySubscription();
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMousedown(event: MouseEvent | TouchEvent): void {
    this.ngZone.runOutsideAngular(() => {
      this.run(event);
    });
  }

  run(event: MouseEvent | TouchEvent): void {
    const classList = (<HTMLElement>(event.target)).classList;
    const isSouth = classList.contains('resize-handle-s');
    const isEast = classList.contains('resize-handle-e');
    const isSouthEast = classList.contains('resize-handle-se');

    const width = this.element.clientWidth;
    const height = this.element.clientHeight;
    const screenX = this.getScreenX(event);
    const screenY = this.getScreenY(event);

    if (isSouth || isEast || isSouthEast) {
      this.initResize(event, isSouth, isEast, isSouthEast);

      const mouseup = merge(
        fromEvent(document, 'mouseup'),
        fromEvent(document, 'touchend')
      );
      this.subscription = mouseup
        .subscribe((ev: MouseEvent | TouchEvent) => this.onMouseup());

      const mouseMoveSub = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'touchmove')
      )
        .pipe(takeUntil(mouseup))
        .subscribe((e: MouseEvent | TouchEvent) => this.move(e, width, height, screenX, screenY));

      this.subscription.add(mouseMoveSub);
    }
  }

  getScreenX(event: MouseEvent | TouchEvent) {
    return (<MouseEvent>event).screenX || ((<TouchEvent>event).targetTouches && (<TouchEvent>event).targetTouches[0].screenX);
  }

  getScreenY(event: MouseEvent | TouchEvent) {
    return (<MouseEvent>event).screenY || ((<TouchEvent>event).targetTouches && (<TouchEvent>event).targetTouches[0].screenY);
  }

  move(event: MouseEvent | TouchEvent, width: number, height: number, screenX: number, screenY: number): void {
    const movementX = this.getScreenX(event) - screenX;
    const movementY = this.getScreenY(event) - screenY;
    this.newWidth = width + movementX;
    this.newHeight = height + movementY;
    this.resizeWidth();
    this.resizeHeight();
  }

  onMouseup(): void {
    this.endResize();
    this.destroySubscription();
  }

  private destroySubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  private createHandle(edgeClass: string) {
    const node = this.renderer.createElement('span');
    this.renderer.addClass(node, edgeClass);
    this.renderer.appendChild(this.element, node);
  }

  initResize(event: MouseEvent | TouchEvent, isSouth: boolean, isEast: boolean, isSouthEast: boolean) {
    if (isSouth) {
      this.resizingS = true;
    }
    if (isEast) {
      this.resizingE = true;
    }
    if (isSouthEast) {
      this.resizingSE = true;
    }
    this.element.classList.add('resizing');

    event.stopPropagation();
    this.resizeBegin.emit();
  }

  endResize() {
    this.resizingS = false;
    this.resizingE = false;
    this.resizingSE = false;
    this.element.classList.remove('resizing');
    this.resizeEnd.emit({ width: this.newWidth, height: this.newHeight });
  }

  resizeWidth() {
    const overMinWidth = !this.minWidth || this.newWidth >= this.minWidth;
    const underMaxWidth = !this.maxWidth || this.newWidth <= this.maxWidth;

    if (this.resizingSE || this.resizingE) {
      if (overMinWidth && underMaxWidth) {
        if (!this.ghost) {
          this.element.style.width = `${this.newWidth}px`;
        }
        this.resize.emit({ event, width: this.newWidth, height: this.newHeight, direction: 'horizontal' });
      }
    }
  }

  resizeHeight() {
    const overMinHeight = !this.minHeight || this.newHeight >= this.minHeight;
    const underMaxHeight = !this.maxHeight || this.newHeight <= this.maxHeight;

    if (this.resizingSE || this.resizingS) {
      if (overMinHeight && underMaxHeight) {
        if (!this.ghost) {
          this.element.style.height = `${this.newHeight}px`;
        }
        this.resize.emit({ event, width: this.newWidth, height: this.newHeight, direction: 'vertical' });
      }
    }
  }

}
