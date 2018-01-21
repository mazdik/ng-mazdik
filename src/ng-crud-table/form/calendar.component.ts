import {Component} from '@angular/core';
import {InputComponent} from './input.component';


@Component({
  selector: 'app-form-calendar',
  template: `
    <div class="df-group" [ngClass]="{'df-has-error':hasError()}">
      <label [attr.for]="column.name">{{column.title}}</label>
      <input type="datetime-local"
             class="df-control"
             [(ngModel)]="model"
             [disabled]="disabled"/>
      <div class="df-help-block">
        <span *ngFor="let err of errors">{{err}}<br></span>
      </div>
    </div>
  `
})
export class CalendarComponent extends InputComponent {

}
