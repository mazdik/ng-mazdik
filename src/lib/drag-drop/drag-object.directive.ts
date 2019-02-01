import { Directive, Input, OnDestroy, ElementRef, HostListener, Output, EventEmitter, NgZone } from '@angular/core';
import { DraggableDirective } from '../draggable';
import { Subscription } from 'rxjs';
import { getEvent } from '../common/utils';

export interface DragObjectEvent {
  model: any;
  position: number;
}

@Directive({
  selector: '[appDragObject]'
})
export class DragObjectDirective implements OnDestroy {

  @Input() dropTarget: HTMLElement;
  @Input() model: any;
  @Output() dropped: EventEmitter<DragObjectEvent> = new EventEmitter();
  @Output() reorder: EventEmitter<DragObjectEvent> = new EventEmitter();

  private subscriptions: Subscription[] = [];
  private old: any = {};
  private clone: HTMLElement;
  private draggableDirective: DraggableDirective;

  constructor(private element: ElementRef, private ngZone: NgZone) {
    this.draggableDirective = new DraggableDirective(this.element, this.ngZone);

    const subDragStart = this.draggableDirective.dragStart.subscribe(event => {
      this.onDragStart();
    });
    const subDragMove = this.draggableDirective.dragMove.subscribe(event => {
      this.onDragMove(event);
    });
    const subDragEnd = this.draggableDirective.dragEnd.subscribe(event => {
      this.onDragEnd(event);
    });
    this.subscriptions.push(subDragStart);
    this.subscriptions.push(subDragMove);
    this.subscriptions.push(subDragEnd);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMousedown(event: MouseEvent | TouchEvent): void {
    this.draggableDirective.onMousedown(event);
  }

  onDragStart() {
    this.old = {
      zIndex: this.element.nativeElement.style.zIndex,
      position: this.element.nativeElement.style.position,
      left: this.element.nativeElement.style.left,
      top: this.element.nativeElement.style.top,
      width: this.element.nativeElement.style.width,
    };
    this.clone = this.element.nativeElement.cloneNode(true);
    this.clone.classList.remove('dragging');
    this.clone.classList.add('drag-placeholder');

    this.element.nativeElement.style.width = this.element.nativeElement.offsetWidth + 'px';
    this.element.nativeElement.style.zIndex = 999;
    this.element.nativeElement.style.position = 'absolute';

    if (this.clone) {
      this.clone = this.element.nativeElement.parentElement.insertBefore(this.clone, this.element.nativeElement.nextSibling);
    }
  }

  onDragMove(event) {
  }

  onDragEnd(event: MouseEvent | TouchEvent) {
    let elem = this.findDropTarget(event);
    const numPos = this.getNumberPosition(elem);
    elem = this.findDragZone(elem);
    const parent = this.element.nativeElement.parentElement;

    if (elem === this.dropTarget) {
      this.dropped.emit({model: this.model, position: numPos});
    } else if (elem === parent) {
      this.reorder.emit({model: this.model, position: numPos});
    }

    this.element.nativeElement.style.width = this.old.width;
    this.element.nativeElement.style.zIndex = this.old.zIndex;
    this.element.nativeElement.style.position = this.old.position;
    this.element.nativeElement.style.left = this.old.left;
    this.element.nativeElement.style.top = this.old.top;

    if (this.clone) {
      try {
        parent.removeChild(this.clone);
      } catch (e) {
      }
    }
  }

  findDropTarget(event: MouseEvent | TouchEvent) {
    const evt = getEvent(event);
    this.element.nativeElement.hidden = true;
    const elem = document.elementFromPoint(evt.clientX, evt.clientY);
    this.element.nativeElement.hidden = false;
    return elem;
  }

  findDragZone(elem) {
    const dragTarget = this.element.nativeElement.parentElement;
    while (elem !== document && elem !== this.dropTarget && elem !== dragTarget) {
      elem = elem.parentNode;
    }
    return elem;
  }

  getNumberPosition(elem) {
    const dragTarget: HTMLElement = this.element.nativeElement.parentElement;
    if (elem === dragTarget) {
      return dragTarget.children ? dragTarget.children.length - 1 : 0;
    }
    if (elem === this.dropTarget) {
      return this.dropTarget.children ? this.dropTarget.children.length - 1 : 0;
    }
    let spanCount = 0;
    while (elem = elem.previousSibling) {
      if (elem.classList && elem.classList.length && !elem.classList.contains('drag-placeholder')) {
        spanCount++;
      }
    }
    return spanCount;
  }

}
