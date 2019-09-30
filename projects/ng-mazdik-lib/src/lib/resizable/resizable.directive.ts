import {
  Directive, ElementRef, HostListener, Input, Output, EventEmitter, OnDestroy, AfterViewInit
} from '@angular/core';
import {Subscription, fromEvent} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {isLeftButton, getEvent} from '../common/utils';
import {ResizableEvent} from './types';

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
  @Output() resizing: EventEmitter<ResizableEvent> = new EventEmitter();
  @Output() resizeEnd: EventEmitter<ResizableEvent> = new EventEmitter();

  element: HTMLElement;
  private subscription: Subscription;
  private newWidth: number;
  private newHeight: number;
  private resizingS: boolean; // south
  private resizingE: boolean; // east
  private resizingSE: boolean; // south-east

  constructor(element: ElementRef) {
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
    if (!isLeftButton(event)) {
      return;
    }
    const classList = ((event.target) as HTMLElement).classList;
    const isSouth = classList.contains('resize-handle-s');
    const isEast = classList.contains('resize-handle-e');
    const isSouthEast = classList.contains('resize-handle-se');

    const evt = getEvent(event);
    const width = this.element.clientWidth;
    const height = this.element.clientHeight;
    const screenX = evt.screenX;
    const screenY = evt.screenY;

    const isTouchEvent = event.type.startsWith('touch');
    const moveEvent = isTouchEvent ? 'touchmove' : 'mousemove';
    const upEvent = isTouchEvent ? 'touchend' : 'mouseup';

    if (isSouth || isEast || isSouthEast) {
      this.initResize(event, isSouth, isEast, isSouthEast);

      const mouseup = fromEvent(document, upEvent);
      this.subscription = mouseup
        .subscribe((ev: MouseEvent | TouchEvent) => this.onMouseup(ev));

      const mouseMoveSub = fromEvent(document, moveEvent)
        .pipe(takeUntil(mouseup))
        .subscribe((e: MouseEvent | TouchEvent) => this.move(e, width, height, screenX, screenY));

      this.subscription.add(mouseMoveSub);
    }
  }

  move(event: MouseEvent | TouchEvent, width: number, height: number, screenX: number, screenY: number): void {
    const evt = getEvent(event);
    const movementX = evt.screenX - screenX;
    const movementY = evt.screenY - screenY;
    this.newWidth = width + movementX;
    this.newHeight = height + movementY;
    this.resizeWidth(evt);
    this.resizeHeight(evt);
  }

  onMouseup(event: MouseEvent | TouchEvent): void {
    this.endResize(event);
    this.destroySubscription();
  }

  private destroySubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  private createHandle(edgeClass: string) {
    const node = document.createElement('span');
    node.className = edgeClass;
    this.element.appendChild(node);
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
    this.newWidth = this.element.clientWidth;
    this.newHeight = this.element.clientHeight;

    event.stopPropagation();
    this.resizeBegin.emit();
  }

  endResize(event: MouseEvent | TouchEvent) {
    this.resizingS = false;
    this.resizingE = false;
    this.resizingSE = false;
    this.element.classList.remove('resizing');
    this.resizeEnd.emit({ event: getEvent(event), width: this.newWidth, height: this.newHeight });
  }

  resizeWidth(event: MouseEvent | Touch) {
    const overMinWidth = !this.minWidth || this.newWidth >= this.minWidth;
    const underMaxWidth = !this.maxWidth || this.newWidth <= this.maxWidth;

    if (this.resizingSE || this.resizingE) {
      if (overMinWidth && underMaxWidth) {
        if (!this.ghost) {
          this.element.style.width = `${this.newWidth}px`;
        }
        this.resizing.emit({ event, width: this.newWidth, height: this.newHeight, direction: 'horizontal' });
      }
    }
  }

  resizeHeight(event: MouseEvent | Touch) {
    const overMinHeight = !this.minHeight || this.newHeight >= this.minHeight;
    const underMaxHeight = !this.maxHeight || this.newHeight <= this.maxHeight;

    if (this.resizingSE || this.resizingS) {
      if (overMinHeight && underMaxHeight) {
        if (!this.ghost) {
          this.element.style.height = `${this.newHeight}px`;
        }
        this.resizing.emit({ event, width: this.newWidth, height: this.newHeight, direction: 'vertical' });
      }
    }
  }

}
