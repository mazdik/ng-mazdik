import {Component, ChangeDetectionStrategy} from '@angular/core';
import {InputOptionComponent} from './input-option.component';

@Component({
  selector: 'app-form-radio',
  template: `
    <div class="dt-group" [ngClass]="{'dt-has-error':hasError()}">
      <label [attr.for]="dynElement.name">{{dynElement.title}}</label>
      <i class="dt-loader" *ngIf="loading"></i>
      <div *ngFor="let o of getOptions()">
        <span class="dt-radio">
          <input
            type="radio"
            [name]="dynElement.name"
            [value]="o.id"
            [checked]="model === o.id"
            (click)="model = o.id"
            [disabled]="disabled"/>
          <label>{{o.name ? o.name : o.id}}</label>
        </span>
      </div>
      <div class="dt-help-block">
        <span *ngFor="let err of errors">{{err}}<br></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent extends InputOptionComponent {

}
