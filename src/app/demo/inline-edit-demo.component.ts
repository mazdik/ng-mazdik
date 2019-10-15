import { Component, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'ng-mazdik-lib';

@Component({
  selector: 'app-inline-edit-demo',
  template: `
  <p>Input. Type: text</p>
  <div class="inline-edit-demo">
    <app-inline-edit class="inline-edit-demo-cell"
      [(value)]="model1"
      [viewValue]="model1"
      [editing]="editing1"
      [type]="'text'"
      [selectPlaceholder]="'placeholder'"
      (inputChange)="onInputChange()"
      (focusChange)="onInputFocus()"
      (blurChange)="onInputBlur()">
    </app-inline-edit>
    &nbsp;
    <button class="dt-button" (click)="editing1=!editing1">{{editing1 ? 'View' : 'Edit'}}</button>&nbsp;
  </div>
  <p>Select. Type: number</p>
  <div class="inline-edit-demo">
    <app-inline-edit class="inline-edit-demo-cell"
      [(value)]="model2"
      [viewValue]="viewValue2()"
      [editing]="editing2"
      [type]="'number'"
      [options]="options">
    </app-inline-edit>
    &nbsp;
    <button class="dt-button" (click)="editing2=!editing2">{{editing2 ? 'View' : 'Edit'}}</button>&nbsp;
  </div>
  `,
  styles: [`
    .inline-edit-demo {display: flex; height: 3em;}
    .inline-edit-demo-cell.dt-inline-editor {width: 10em; line-height: 3em; border: 1px solid #eee;}
  `],
  styleUrls: ['../../../dist/ng-mazdik-lib/styles/buttons.css'],
  encapsulation: ViewEncapsulation.None,
})
export class InlineEditDemoComponent {

  model1: string = 'string';
  model2: number = 2;
  editing1: boolean;
  editing2: boolean;

  options: SelectItem[] = [
    {id: 1, name: 'Select 1'},
    {id: 2, name: 'Select 2'},
    {id: 3, name: 'Select 3'},
    {id: 4, name: 'Select 4'},
    {id: 5, name: 'Select 5'},
    {id: 6, name: 'Select 6'},
  ];

  constructor() { }

  onInputChange() {}
  onInputFocus() {}
  onInputBlur() {}

  viewValue2() {
    return this.options.find(x => x.id === this.model2).name;
  }

}
