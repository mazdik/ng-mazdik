import { Component } from '@angular/core';
import { SelectItem } from 'ng-mazdik-lib';

@Component({
  selector: 'app-dropdown-select-demo',
  template: `
  <div class="sl-row">
    <app-dropdown-select class="sl-column"
      [value]="selectedOptions1"
      [options]="options"
      [multiple]="true"
      (valueChange)="onValueChange()">
    </app-dropdown-select>
    <app-dropdown-select class="sl-column"
      [value]="selectedOptions2"
      [options]="options"
      [multiple]="false"
      (valueChange)="onValueChange()">
    </app-dropdown-select>
  </div>
  `,
  styles: [`
    .sl-row {display: flex;}
    .sl-column {margin-right: 2em; width: 20em;}
  `],
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

  onValueChange(): void { }
}
