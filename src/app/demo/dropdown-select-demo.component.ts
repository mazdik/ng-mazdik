import { Component } from '@angular/core';
import { SelectItem } from 'ng-mazdik-lib';

@Component({
  selector: 'app-dropdown-select-demo',
  template: `
  <div class="dropdown-select-demo">
    <app-dropdown-select class="sl-column"
      [value]="selectedOptions1"
      [options]="options"
      [multiple]="true"
      (valueChange)="onValueChange1($event)">
    </app-dropdown-select>
    <app-dropdown-select class="sl-column"
      [value]="selectedOptions2"
      [options]="options"
      [multiple]="false"
      (valueChange)="onValueChange2($event)">
    </app-dropdown-select>
  </div>
  `,
})
export class DropdownSelectDemoComponent {

  options: SelectItem[] = [
    {id: 1, name: 'Select 1'},
    {id: 2, name: 'Select 2'},
    {id: 3, name: 'Select 3'},
    {id: 4, name: 'Select 4'},
    {id: 5, name: 'Select 5'},
    {id: 6, name: 'Select 6'},
  ];
  selectedOptions1: number[] = [2, 4];
  selectedOptions2: number[] = [2];

  constructor() { }

  onValueChange1(event): void {
    this.selectedOptions1 = event;
  }

  onValueChange2(event): void {
    this.selectedOptions2 = event;
  }
}
