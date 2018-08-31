import {Component, ChangeDetectionStrategy} from '@angular/core';
import {InputComponent} from './input.component';

@Component({
  selector: 'app-form-textarea',
  template: `
    <div class="df-group" [ngClass]="{'df-has-error':hasError()}">
      <label [attr.for]="column.name">{{column.title}}</label>
      <textarea class="df-control"
                [(ngModel)]="model"
                [id]="column.name"
                [disabled]="disabled">
      </textarea>
      <div class="df-help-block">
        <span *ngFor="let err of errors">{{err}}<br></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent extends InputComponent {

}
