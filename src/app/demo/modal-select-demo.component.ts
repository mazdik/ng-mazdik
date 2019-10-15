import { Component } from '@angular/core';
import { SelectItem } from 'ng-mazdik-lib';

@Component({
  selector: 'app-modal-select-demo',
  template: `
  <app-modal-select class="modal-select-demo"
    [(value)]="model"
    [options]="options"
    (valueChange)="onValueChange()">
  </app-modal-select>
  `,
  styles: [`.modal-select-demo {display: block; width: 20em;}`],
})
export class ModalSelectDemoComponent {

  options: SelectItem[] = [];
  model: number;

  constructor() {
    for (let index = 1; index <= 30; index++) {
      this.options.push({id: index, name: `Select ${index}`});
    }
  }

  onValueChange(): void { }
}
