import { Component, ViewChild } from '@angular/core';
import { MenuItem, ContextMenuComponent, MenuEventArgs } from 'ng-mazdik-lib';

@Component({
  selector: 'app-context-menu-demo',
  template: `
    <button class="dt-button" (click)="show($event)">context menu</button>&nbsp;
    <app-context-menu #contextMenu [menu]="items"></app-context-menu>
  `,
})
export class ContextMenuDemoComponent {

  items: MenuItem[] = [
    {label: 'View Task', command: (event) => console.log(event)},
    {label: 'Edit Task', command: (event) => console.log(event)},
    {label: 'Delete Task', command: (event) => console.log(event), disabled: true}
  ];
  @ViewChild('contextMenu', {static: true}) contextMenu: ContextMenuComponent;

  constructor() { }

  show(event) {
    const left = event.target.offsetLeft + event.target.offsetWidth;
    const top = event.target.offsetTop;
    this.contextMenu.show({originalEvent: event, data: 'test', left, top} as MenuEventArgs);
  }

  hide() {
    this.contextMenu.hide();
  }

}
