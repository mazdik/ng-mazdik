import { Component } from '@angular/core';
import { SelectItem } from 'ng-mazdik-lib/lib/common';

@Component({
  selector: 'app-dual-list-box-demo',
  template: `
  <app-dual-list-box
    [source]="source"
    [target]="target"
    [sourceTitle]="'Source title'"
    [targetTitle]="'Target title'"
    (targetChange)="onSelectionChange($event)">
  </app-dual-list-box>
  `,
  styles: [`app-dual-list-box {min-width: 400px; max-width: 600px}`]
})
export class DualListBoxDemoComponent {

  source: SelectItem[] = [
    {id: 1, name: 'name 1'},
    {id: 2, name: 'name 2'},
    {id: 3, name: 'name 3'},
    {id: 4, name: 'name 4'},
    {id: 5, name: 'name 5'},
    {id: 6, name: 'name 6'},
    {id: 7, name: 'name 7'},
    {id: 8, name: 'name 8'},
  ];
  target: SelectItem[] = [
    {id: 9, name: 'name 9'},
    {id: 10, name: 'name 10'},
    {id: 11, name: 'name 11'},
    {id: 12, name: 'name 12'},
  ];

  constructor() { }

  onSelectionChange(event) {
    console.log(event);
  }
}
