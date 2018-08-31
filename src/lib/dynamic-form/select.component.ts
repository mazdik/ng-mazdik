import {Component, ChangeDetectionStrategy} from '@angular/core';
import {InputOptionComponent} from './input-option.component';

@Component({
  selector: 'app-form-select',
  template: `
    <div class="df-group" [ngClass]="{'df-has-error':hasError()}">
      <label [attr.for]="column.name">{{column.title}}</label>
      <i class="icon-collapsing" *ngIf="loading"></i>
      <select class="df-control"
              [(ngModel)]="model"
              [id]="column.name"
              (change)="onValueChange()"
              [disabled]="disabled">
        <option *ngFor="let opt of getOptions()" [value]="opt.id">{{opt.name}}</option>
      </select>
      <div class="df-help-block">
        <span *ngFor="let err of errors">{{err}}<br></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent extends InputOptionComponent {

}
