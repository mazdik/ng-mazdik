import { Component, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'ng-mazdik-lib';

@Component({
  selector: 'app-select-list-demo',
  template: `
  <div class="sl-row">
    <app-select-list class="sl-column"
        [options]="options"
        [selected]="selectedOptions1"
        [multiple]="true"
        [isOpen]="true"
        (selectionChange)="onSelectionChange($event)"
        (selectionCancel)="onSelectionCancel()">
    </app-select-list>
    <app-select-list class="sl-column"
        [options]="options"
        [selected]="selectedOptions2"
        [multiple]="false"
        [isOpen]="true"
        (selectionChange)="onSelectionChange($event)"
        (selectionCancel)="onSelectionCancel()">
    </app-select-list>
  </div>
  `,
  styles: [`
    .sl-row {display: flex;}
    .sl-column {margin-right: 2em; width: 20em; padding: 1em; border: 0.1em solid #eee; border-radius: 0.1em;}
  `],
  styleUrls: ['../../../dist/ng-mazdik-lib/styles/buttons.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectListDemoComponent {

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

  onSelectionChange(event) {
    console.log(event);
  }

  onSelectionCancel() {
  }

}
