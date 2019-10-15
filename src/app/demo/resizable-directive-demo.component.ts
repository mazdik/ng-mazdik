import { Component, ViewEncapsulation } from '@angular/core';

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
  styleUrls: ['../../../dist/ng-mazdik-lib/styles/resizable.css'],
  styles: [`
    .dd-box {position: absolute; width: 200px; height: 200px;}
    .box1 {background-color: #009ccc;}
  `],
  encapsulation: ViewEncapsulation.None,
})
export class ResizableDirectiveDemoComponent {

  constructor() { }

  onResize($event) {}

}
