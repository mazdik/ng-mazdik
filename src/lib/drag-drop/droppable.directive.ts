import { Directive, Input, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { DragElementEvent, DropElementEvent } from './types';

@Directive({
  selector: '[appDroppable]'
})
export class DroppableDirective  {

  @Input() dragElementEvent: DragElementEvent;
  @Output() dropElement: EventEmitter<DropElementEvent> = new EventEmitter();

  constructor(private element: ElementRef) {}

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const dragParentElement = (this.dragElementEvent.event.target as HTMLElement).parentElement;
    const position = Math.max(0, this.getNumberPosition(event.target));

    if (dragParentElement === this.element.nativeElement) {
      this.dropElement.emit({ previousIndex: this.dragElementEvent.index, currentIndex: position, type: 'reorder' });
    } else {
      this.dropElement.emit({ previousIndex: this.dragElementEvent.index, currentIndex: position, type: 'move' });
    }
  }

  private getNumberPosition(elem) {
    const dragTarget: HTMLElement = (this.dragElementEvent.event.target as HTMLElement).parentElement;
    const dropTarget: HTMLElement = this.element.nativeElement;
    if (elem === dragTarget) {
      return dragTarget.children ? dragTarget.children.length : 0;
    }
    if (elem === dropTarget) {
      return dropTarget.children ? dropTarget.children.length : 0;
    }
    let spanCount = 0;
    while (elem = elem.previousSibling) {
      spanCount++;
    }
    return spanCount - 1;
  }

}
