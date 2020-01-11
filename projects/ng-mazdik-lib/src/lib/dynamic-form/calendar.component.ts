import {Component, ChangeDetectionStrategy} from '@angular/core';
import {InputComponent} from './input.component';
import {inputFormattedDate} from '../common/utils';

@Component({
  selector: 'app-form-calendar',
  template: `
    <div class="dt-group" [ngClass]="{'dt-has-error':dynElement.hasError}">
      <label [attr.for]="dynElement.name">{{dynElement.title}}</label>
      <input class="dt-input"
             [attr.type]="dynElement.type"
             [value]="formattedDate"
             (input)="model = $event.target.value"
             [disabled]="disabled">
      <div class="dt-help-block">
        <span *ngFor="let err of dynElement.errors">{{err}}<br></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent extends InputComponent {

  get formattedDate() {
    return inputFormattedDate(this.dynElement.type, this.model);
  }

}
