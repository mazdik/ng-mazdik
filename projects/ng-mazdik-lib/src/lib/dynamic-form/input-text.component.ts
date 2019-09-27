import {Component, ChangeDetectionStrategy} from '@angular/core';
import {InputComponent} from './input.component';

@Component({
  selector: 'app-form-input-text',
  template: `
    <div class="dt-group" [ngClass]="{'dt-has-error':hasError()}">
      <label [attr.for]="dynElement.name">{{dynElement.title}}</label>
      <input type="text"
             class="dt-input"
             placeholder="{{dynElement.title}}"
             id="{{dynElement.name}}"
             [value]="model || null"
             (input)="model = $event.target.value"
             [disabled]="disabled"/>
      <div class="dt-help-block">
        <span *ngFor="let err of errors">{{err}}<br></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent extends InputComponent {

}
