import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-resizable-directive-demo',
  template: `
  <div class="dd-box box1"
    appResizable
    [south]="true"
    [east]="true"
    [southEast]="true"
    [minWidth]="200"
    [minHeight]="200"
    [maxWidth]="500"
    [maxHeight]="500"
    (resizing)="onResize($event)">
  </div>
  `,
})
export class ResizableDirectiveDemoComponent {

  @HostBinding('class.resizable-directive-demo') cssClass = true;

  onResize($event) {}

}
