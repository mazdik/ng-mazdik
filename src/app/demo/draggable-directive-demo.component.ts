import { Component, HostBinding } from '@angular/core';

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
})
export class DraggableDirectiveDemoComponent {

  dragEventTarget1: MouseEvent | TouchEvent;
  dragEventTarget2: MouseEvent | TouchEvent;

  @HostBinding('class.draggable-directive-demo') cssClass = true;

}
