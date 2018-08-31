import {Component, ChangeDetectionStrategy} from '@angular/core';
import {InputComponent} from './input.component';

@Component({
  selector: 'app-form-input-text',
  template: `
    <div class="df-group" [ngClass]="{'df-has-error':hasError()}">
      <label [attr.for]="column.name">{{column.title}}</label>
      <input type="text"
             class="df-control"
             [(ngModel)]="model"
             [attr.placeholder]="column.title"
             [id]="column.name"
             [disabled]="disabled"/>
      <div class="df-help-block">
        <span *ngFor="let err of errors">{{err}}<br></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent extends InputComponent {

}
