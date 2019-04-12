import {Component, ChangeDetectionStrategy} from '@angular/core';
import {InputComponent} from './input.component';

@Component({
  selector: 'app-form-textarea',
  template: `
    <div class="dt-group" [ngClass]="{'dt-has-error':hasError()}">
      <label [attr.for]="dynElement.name">{{dynElement.title}}</label>
      <textarea class="dt-input"
                id="{{dynElement.name}}"
                [value]="model || null"
                (input)="model = $event.target.value"
                [disabled]="disabled">
      </textarea>
      <div class="dt-help-block">
        <span *ngFor="let err of errors">{{err}}<br></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent extends InputComponent {

}
