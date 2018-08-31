import {Component, ChangeDetectionStrategy} from '@angular/core';
import {InputComponent} from './input.component';

@Component({
  selector: 'app-form-calendar',
  template: `
    <div class="df-group" [ngClass]="{'df-has-error':hasError()}">
      <label [attr.for]="column.name">{{column.title}}</label>
      <input class="df-control"
             [attr.type]="column.type"
             [(ngModel)]="model"
             [disabled]="disabled"/>
      <div class="df-help-block">
        <span *ngFor="let err of errors">{{err}}<br></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent extends InputComponent {

}
