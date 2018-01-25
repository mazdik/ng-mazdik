import {Component} from '@angular/core';
import {InputOptionComponent} from './input-option.component';


@Component({
  selector: 'app-form-select-popup',
  template: `
    <div class="df-group" [ngClass]="{'df-has-error':hasError()}">
      <label [attr.for]="column.name">{{column.title}}</label>
      <i class="icon-collapsing" *ngIf="loading"></i>
      <app-modal-select [(value)]="model"
                    [options]="getOptions()"
                    [disabled]="disabled"
                    (valueChange)="onValueChange($event)">
      </app-modal-select>
      <div class="df-help-block">
        <span *ngFor="let err of errors">{{err}}<br></span>
      </div>
    </div>
  `
})
export class PopupSelectComponent extends InputOptionComponent {

}
