import {Component, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
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
                    [modalTitle]="column.title"
                    (valueChange)="onValueChange()"
                    (nameChanged)="nameChanged.emit($event)">
      </app-modal-select>
      <div class="df-help-block">
        <span *ngFor="let err of errors">{{err}}<br></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupSelectComponent extends InputOptionComponent {

  @Output() nameChanged: EventEmitter<any> = new EventEmitter();

}
