import {Component, ChangeDetectionStrategy} from '@angular/core';
import {InputOptionComponent} from './input-option.component';

@Component({
  selector: 'app-form-select-dropdown',
  template: `
    <div class="df-group" [ngClass]="{'df-has-error':hasError()}">
      <label [attr.for]="dynElement.name">{{dynElement.title}}</label>
      <i class="icon-collapsing" *ngIf="loading"></i>
      <app-dropdown-select [(value)]="model"
                           [options]="getOptions()"
                           (valueChange)="onValueChange()">
      </app-dropdown-select>
      <div class="df-help-block">
        <span *ngFor="let err of errors">{{err}}<br></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDropdownComponent extends InputOptionComponent {

}
