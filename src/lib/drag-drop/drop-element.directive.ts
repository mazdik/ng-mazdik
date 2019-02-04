import { Directive, Input, ElementRef, HostListener, Output, EventEmitter, NgZone } from '@angular/core';
import { DragElementEvent, DropElementEvent } from './types';

@Directive({
  selector: '[appDropElement]'
})
export class DropElementDirective  {

  @Input() dragElementEvent: DragElementEvent;
  @Output() dropElement: EventEmitter<DropElementEvent> = new EventEmitter();

  constructor(private element: ElementRef, private ngZone: NgZone) {}

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
    const dragParentElement = (<HTMLElement>this.dragElementEvent.event.target).parentElement;
    const position = Math.max(0, this.getNumberPosition(event.target) - 1);

    if (dragParentElement === this.element.nativeElement) {
      this.dropElement.emit({
        model: this.dragElementEvent.model, previousIndex: this.dragElementEvent.index, currentIndex: position, type: 'reorder'
      });
    } else {
      this.dropElement.emit({
        model: this.dragElementEvent.model, previousIndex: this.dragElementEvent.index, currentIndex: position, type: 'move'
      });
    }
  }

  private getNumberPosition(elem) {
    const dragTarget: HTMLElement = (<HTMLElement>this.dragElementEvent.event.target).parentElement;
    const dropTarget: HTMLElement = this.element.nativeElement;
    if (elem === dragTarget) {
      return dragTarget.children ? dragTarget.children.length : 1;
    }
    if (elem === dropTarget) {
      return dropTarget.children ? dropTarget.children.length : 1;
    }
    let spanCount = 0;
    while (elem = elem.previousSibling) {
      spanCount++;
    }
    return spanCount;
  }

}
