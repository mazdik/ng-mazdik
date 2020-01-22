import { Component } from '@angular/core';
import { SelectItem } from 'ng-mazdik-lib';

@Component({
  selector: 'app-inline-edit-demo',
  template: `
  <p>Input. Type: text</p>
  <div class="inline-edit-demo">
    <app-inline-edit class="inline-edit-demo-cell"
      [value]="model1"
      [viewValue]="model1"
      [editing]="editing1"
      [type]="'text'"
      [selectPlaceholder]="'placeholder'"
      (valueChange)="model1=$event"
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
      [value]="model2"
      [viewValue]="viewValue2()"
      [editing]="editing2"
      [type]="'number'"
      [options]="options"
      (valueChange)="model2=$event">
    </app-inline-edit>
    &nbsp;
    <button class="dt-button" (click)="editing2=!editing2">{{editing2 ? 'View' : 'Edit'}}</button>&nbsp;
  </div>
  <p>Input. Type: date</p>
  <div class="inline-edit-demo">
    <app-inline-edit class="inline-edit-demo-cell"
      [value]="model3"
      [viewValue]="model3"
      [editing]="editing3"
      [type]="'date'"
      (valueChange)="model3=$event">
    </app-inline-edit>
    &nbsp;
    <button class="dt-button" (click)="editing3=!editing3">{{editing3 ? 'View' : 'Edit'}}</button>&nbsp;
  </div>
  `
})
export class InlineEditDemoComponent {

  model1: string = 'string';
  model2: number = 2;
  model3: Date = new Date();
  editing1: boolean;
  editing2: boolean;
  editing3: boolean;

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
