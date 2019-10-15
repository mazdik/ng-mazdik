import { Component } from '@angular/core';

@Component({
  selector: 'app-draggable-directive-demo',
  template: `
  <div class="dd-box box1"
    appDraggable
    [dragEventTarget]="dragEventTarget1"
    (mousedown)="dragEventTarget1 = $event"
    (touchstart)="dragEventTarget1 = $event">
  </div>
  <div class="dd-box box2"
    appDraggable
    [dragEventTarget]="dragEventTarget2"
    (mousedown)="dragEventTarget2 = $event"
    (touchstart)="dragEventTarget2 = $event">
  </div>
  `,
  styles: [`
    .dd-box {position: absolute; width: 200px; height: 200px;}
    .box1 {background-color: #009ccc;}
    .box2 {background-color: #f2cb1d; left: 500px;}
    .dragging {cursor: move;}
  `]
})
export class DraggableDirectiveDemoComponent {

  dragEventTarget1: MouseEvent | TouchEvent;
  dragEventTarget2: MouseEvent | TouchEvent;

  constructor() { }

}
