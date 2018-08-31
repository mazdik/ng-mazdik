import {Component, ChangeDetectionStrategy} from '@angular/core';
import {InputOptionComponent} from './input-option.component';

@Component({
  selector: 'app-form-radio',
  template: `
    <div class="df-group" [ngClass]="{'df-has-error':hasError()}">
      <label [attr.for]="column.name">{{column.title}}</label>
      <i class="icon-collapsing" *ngIf="loading"></i>
      <div *ngFor="let o of getOptions()">
        <span class="datatable-radio">
          <input
            type="radio"
            [(ngModel)]="model"
            [name]="column.name"
            [value]="o.id"
            [checked]="model === o.id"
            (click)="model = o.id"
            [disabled]="disabled"/>
          <label>{{o.name ? o.name : o.id}}</label>
        </span>
      </div>
      <div class="df-help-block">
        <span *ngFor="let err of errors">{{err}}<br></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent extends InputOptionComponent {

}
