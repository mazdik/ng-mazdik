import {Component} from '@angular/core';
import {SelectItem, arrayMove, arrayTransfer, DragElementEvent, DropElementEvent} from 'ng-mazdik-lib';

class Item extends SelectItem {
  text: string;
}

@Component({
  selector: 'app-drag-drop-demo',
  template: `
  <div class="dd-row">
    <div class="dd-column" appDroppable [dragElementEvent]="dragElementEvent" (dropElement)="onDropSource($event)">
      <div class="dd-issue"
        *ngFor="let option of source; index as i"
        (click)="sourceModel = option.id"
        [ngClass]="{'active': sourceModel === option.id}"
        [draggable]="true"
        (dragstart)="onDragStart($event, i); sourceModel = option.id">
          <div class="dd-title">{{option.name}}</div>
          <div class="dd-text">{{option.text}}</div>
      </div>
    </div>
    <div class="dd-column" appDroppable [dragElementEvent]="dragElementEvent" (dropElement)="onDropTarget($event)">
      <div class="dd-issue"
        *ngFor="let option of target; index as i"
        (click)="targetModel = option.id"
        [ngClass]="{'active': targetModel === option.id}"
        [draggable]="true"
        (dragstart)="onDragStart($event, i); targetModel = option.id">
          <div class="dd-title">{{option.name}}</div>
          <div class="dd-text">{{option.text}}</div>
      </div>
    </div>
  </div>
  `,
  styles: [
    `.dd-row { display: flex; }
    .dd-column { width: 20%; height: 100%; min-height: 500px; }
    .dd-column + .dd-column { margin-left: 10px; }
    .dd-column:nth-child(1) { background: rgb(255, 255, 219); }
    .dd-column:nth-child(2) { background: rgb(236, 236, 191); }
    .dd-column:nth-child(3) { background: rgb(253, 214, 162); }
    .dd-column:nth-child(4) { background: rgb(162, 226, 253); }
    .dd-column:nth-child(5) { background: rgb(162, 253, 200); }
    .dd-issue {
      background: rgba(0, 0, 0, .1);
      border-radius: 4px;
      margin-bottom: 4px;
      cursor: move;
      position: relative;
      color: #000;
      overflow: hidden;
    }
    .dd-issue:hover { background: rgba(0, 0, 0, .15); }
    .dd-title { background: rgba(0, 0, 0, .1); padding: 2px 4px; }
    .dd-text { padding: 3px 4px 1px; line-height: 120%; }
    `
  ]
})

export class DragDropDemoComponent {

  source: Item[] = [
    {id: 1, name: 'Task 1', text: 'Write a program that prints ‘Hello World’ to the screen'},
    {id: 2, name: 'Task 2', text: 'Write a program that asks the user for their name and greets them with their name'},
    {id: 3, name: 'Task 3', text: 'Modify the previous program such that only the users Alice and Bob are greeted with their names'},
  ];
  target: Item[] = [
    {id: 4, name: 'Task 4', text: 'Write a program that asks the user for a number n and prints the sum of the numbers 1 to n'},
    {id: 5, name: 'Task 5', text: 'Modify the previous program such that only multiples of three or five are considered in the sum'},
    {id: 6, name: 'Task 6', text: 'Write a program that prints a multiplication table for numbers up to 12'},
  ];
  sourceModel: any;
  targetModel: any;
  dragElementEvent: DragElementEvent;

  constructor() {}

  onDragStart(event: DragEvent, index: number) {
    event.dataTransfer.setData('text', index.toString());
    event.dataTransfer.effectAllowed = 'move';
    this.dragElementEvent = { event, index };
  }

  onDropSource(event: DropElementEvent) {
    if (event.type === 'reorder') {
      arrayMove(this.source, event.previousIndex, event.currentIndex);
    } else {
      arrayTransfer(this.target, this.source, event.previousIndex, event.currentIndex);
    }
    this.targetModel = null;
  }

  onDropTarget(event: DropElementEvent) {
    if (event.type === 'reorder') {
      arrayMove(this.target, event.previousIndex, event.currentIndex);
    } else {
      arrayTransfer(this.source, this.target, event.previousIndex, event.currentIndex);
    }
    this.sourceModel = null;
  }

}
