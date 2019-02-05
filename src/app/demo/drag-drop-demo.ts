import { Component } from '@angular/core';
import { DragElementEvent, DropElementEvent } from '../../lib/drag-drop';
import { arrayMove, arrayTransfer } from '../../lib/common/array-utils';

@Component({
  selector: 'app-drag-drop-demo',
  template: `
    <div class="drag-drop">
    <div #box1 class="drag-box" appDropElement [dragElementEvent]="dragElementEvent" (dropElement)="onDropElement1($event)">
      <div class="drag-elem"
          *ngFor="let item of todo; index as i"
          appDragElement
          [draggable]="true"
          (dragstart)="onDragStart($event, i)">
          {{item}}
      </div>
    </div>
    <div #box2 class="drag-box" appDropElement [dragElementEvent]="dragElementEvent" (dropElement)="onDropElement2($event)">
      <div class="drag-elem"
          *ngFor="let item of done; index as i"
          [draggable]="true"
          (dragstart)="onDragStart($event, i)">
          {{item}}
      </div>
    </div>
  </div>
  `
})

export class DragDropDemoComponent {

  todo = [
    'Defunct',
    'Extaze',
    'Winger',
    'Spartacus'
  ];

  done = [
    'Chester',
    'Rubble',
    'Oumen',
    'Pandorum',
    'Wolverine'
  ];

  dragElementEvent: DragElementEvent;

  constructor() { }

  onDropElement1(event: DropElementEvent) {
    if (event.type === 'reorder') {
      arrayMove(this.todo, event.previousIndex, event.currentIndex);
    } else {
      arrayTransfer(this.done, this.todo, event.previousIndex, event.currentIndex);
    }
  }

  onDropElement2(event: DropElementEvent) {
    if (event.type === 'reorder') {
      arrayMove(this.done, event.previousIndex, event.currentIndex);
    } else {
      arrayTransfer(this.todo, this.done, event.previousIndex, event.currentIndex);
    }
  }

  onDragStart(event: DragEvent, index: number) {
    event.dataTransfer.effectAllowed = 'move';
    this.dragElementEvent = { event, index };
  }

}
