import { Component } from '@angular/core';
import { SelectItem } from 'ng-mazdik-lib';

@Component({
  selector: 'app-tabs-demo',
  template: `<app-tabs [tabs]="tabs" (selectTab)="onSelectTab($event)"></app-tabs>`
})

export class TabsDemoComponent {

  tabs: SelectItem[] = [
    { id: 1, name: 'tab 1' },
    { id: 2, name: 'tab 2' },
    { id: 3, name: 'tab 3' },
    { id: 4, name: 'tab 4' },
    { id: 5, name: 'tab 5' },
  ];

  onSelectTab(event): void {
    console.log(event);
  }

}
