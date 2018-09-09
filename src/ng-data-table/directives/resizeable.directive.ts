import {
  Directive, ElementRef, HostListener, Input, Output, EventEmitter, OnDestroy, AfterViewInit, Renderer2
} from '@angular/core';
import {Subscription, fromEvent} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Directive({
  selector: '[appResizeable]'
})
export class ResizeableDirective implements OnDestroy, AfterViewInit {

  @Input() south: boolean;
  @Input() east: boolean;
  @Input() southEast: boolean;
  @Input() minWidth: number;
  @Input() maxWidth: number;
  @Input() ghost: boolean;
  @Input() minHeight: number;
  @Input() maxHeight: number;

  @Output() resizeBegin: EventEmitter<any> = new EventEmitter();
  @Output() resize: EventEmitter<any> = new EventEmitter();
  @Output() resizeEnd: EventEmitter<any> = new EventEmitter();

  element: HTMLElement;
  private subscription: Subscription;
  private newWidth: number;
  private newHeight: number;
  private resizingS: boolean; // south
  private resizingE: boolean; // east
  private resizingSE: boolean; // south-east

  constructor(element: ElementRef, private renderer: Renderer2) {
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
  onMousedown(event: MouseEvent): void {
    const classList = (<HTMLElement>(event.target)).classList;
    const isSouth = classList.contains('resize-handle-s');
    const isEast = classList.contains('resize-handle-e');
    const isSouthEast = classList.contains('resize-handle-se');

    const width = this.element.clientWidth;
    const height = this.element.clientHeight;
    const screenX = event.screenX;
    const screenY = event.screenY;

    if (isSouth || isEast || isSouthEast) {
      this.initResize(event, isSouth, isEast, isSouthEast);

      const mouseup = fromEvent(document, 'mouseup');
      this.subscription = mouseup
        .subscribe((ev: MouseEvent) => this.onMouseup());

      const mouseMoveSub = fromEvent(document, 'mousemove')
        .pipe(takeUntil(mouseup))
        .subscribe((e: MouseEvent) => this.move(e, width, height, screenX, screenY));

      this.subscription.add(mouseMoveSub);
    }
  }

  move(event: MouseEvent, width: number, height: number, screenX: number, screenY: number): void {
    const movementX = event.screenX - screenX;
    const movementY = event.screenY - screenY;
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

  initResize(event: MouseEvent, isSouth: boolean, isEast: boolean, isSouthEast: boolean) {
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
    this.resizeEnd.emit({
      'width': this.newWidth,
      'height': this.newHeight
    });
  }

  resizeWidth() {
    const overMinWidth = !this.minWidth || this.newWidth >= this.minWidth;
    const underMaxWidth = !this.maxWidth || this.newWidth <= this.maxWidth;

    if (this.resizingSE || this.resizingE) {
      if (overMinWidth && underMaxWidth) {
        if (!this.ghost) {
          this.element.style.width = `${this.newWidth}px`;
        }
        this.resize.emit({
          'event': event,
          'width': this.newWidth,
          'height': this.newHeight
        });
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
        this.resize.emit({
          'event': event,
          'width': this.newWidth,
          'height': this.newHeight
        });
      }
    }
  }

}
