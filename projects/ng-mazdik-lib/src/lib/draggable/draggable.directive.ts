import {
  Directive, ElementRef, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges, NgZone
} from '@angular/core';
import {isLeftButton, getEvent} from '../common/utils';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements OnChanges, OnDestroy {

  @Input() dragEventTarget: MouseEvent | TouchEvent;
  @Input() dragX: boolean = true;
  @Input() dragY: boolean = true;
  @Input() inViewport: boolean;

  @Output() dragStart: EventEmitter<any> = new EventEmitter();
  @Output() dragMove: EventEmitter<any> = new EventEmitter();
  @Output() dragEnd: EventEmitter<any> = new EventEmitter();

  isDragging: boolean;
  lastPageX: number;
  lastPageY: number;
  private globalListeners = new Map<string, {
    handler: (event: Event) => void,
    options?: AddEventListenerOptions | boolean
  }>();
  private elementWidth: number;
  private elementHeight: number;
  private vw: number;
  private vh: number;

  constructor(private element: ElementRef, private ngZone: NgZone) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dragEventTarget && changes.dragEventTarget.currentValue) {
      this.onMousedown(this.dragEventTarget);
    }
  }

  ngOnDestroy(): void {
    this.removeEventListener();
  }

  onMousedown(event: MouseEvent | TouchEvent): void {
    if (!isLeftButton(event)) {
      return;
    }
    if (this.dragX || this.dragY) {
      const evt = getEvent(event);
      this.initDrag(evt.pageX, evt.pageY);
      this.addEventListeners(event);
      this.dragStart.emit(event);
    }
  }

  onMousemove(event: MouseEvent | TouchEvent): void {
    const evt = getEvent(event);
    this.onDrag(evt.pageX, evt.pageY);
    this.dragMove.emit(event);
  }

  onMouseup(event: MouseEvent | TouchEvent): void {
    this.endDrag();
    this.removeEventListener();
    this.dragEnd.emit(event);
  }

  addEventListeners(event: MouseEvent | TouchEvent) {
    const isTouchEvent = event.type.startsWith('touch');
    const moveEvent = isTouchEvent ? 'touchmove' : 'mousemove';
    const upEvent = isTouchEvent ? 'touchend' : 'mouseup';

    this.globalListeners
    .set(moveEvent, {
      handler: this.onMousemove.bind(this),
      options: false
    })
    .set(upEvent, {
      handler: this.onMouseup.bind(this),
      options: false
    });

    this.ngZone.runOutsideAngular(() => {
      this.globalListeners.forEach((config, name) => {
        window.document.addEventListener(name, config.handler, config.options);
      });
    });
  }

  removeEventListener() {
    this.globalListeners.forEach((config, name) => {
      window.document.removeEventListener(name, config.handler, config.options);
    });
  }

  initDrag(pageX: number, pageY: number) {
      this.isDragging = true;
      this.lastPageX = pageX;
      this.lastPageY = pageY;
      this.element.nativeElement.classList.add('dragging');

      this.elementWidth = this.element.nativeElement.offsetWidth;
      this.elementHeight = this.element.nativeElement.offsetHeight;
      this.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      this.vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  }

  onDrag(pageX: number, pageY: number) {
    if (this.isDragging) {
      const deltaX = pageX - this.lastPageX;
      const deltaY = pageY - this.lastPageY;
      const coords = this.element.nativeElement.getBoundingClientRect();
      let leftPos = coords.left + deltaX;
      let topPos = coords.top + deltaY;

      const overWidth = !this.inViewport || leftPos >= 0 && (leftPos + this.elementWidth) <= this.vw;
      const overHeight = !this.inViewport || topPos >= 0 && (topPos + this.elementHeight) <= this.vh;
      if (overWidth) {
        this.lastPageX = pageX;
      }
      if (overHeight) {
        this.lastPageY = pageY;
      }

      if (this.inViewport) {
        if (leftPos < 0) {
          leftPos = 0;
        }
        if ((leftPos + this.elementWidth) > this.vw) {
          leftPos = this.vw - this.elementWidth;
        }
        if (topPos < 0) {
          topPos = 0;
        }
        if ((topPos + this.elementHeight) > this.vh) {
          topPos = this.vh - this.elementHeight;
        }
      }
      this.element.nativeElement.style.left = leftPos + 'px';
      this.element.nativeElement.style.top = topPos + 'px';
    }
  }

  endDrag() {
    this.isDragging = false;
    this.element.nativeElement.classList.remove('dragging');
  }

}
