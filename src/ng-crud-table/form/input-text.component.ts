import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {Column} from '../types/interfaces';
import {CustomValidator} from './custom-validator';


@Component({
  selector: 'app-form-input-text',
  template: `
    <div class="df-group"  [ngClass]="{'df-has-error':hasError()}">
      <label [attr.for]="column.name">{{column.title}}</label>

      <input type="text"
             class="df-control"
             [(ngModel)]="model"
             [attr.placeholder]="column.title"
             (focus)="beginValidate = true"
             [id]="column.name"/>

      <div class="df-help-block">
        <span *ngFor="let err of errors()">{{err}}<br></span>
      </div>
    </div>
  `
})
export class InputTextComponent implements OnInit {

  @Input() public column: Column;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Output() valid: EventEmitter<boolean> = new EventEmitter();

  @Input('value')
  set model(value) {
    if (this._model !== value) {
      this._model = value;
      this.valueChange.emit(this._model);
    }
  }

  get model() {
    return this._model;
  }

  private _model: any;
  public beginValidate: boolean;

  constructor(private validator: CustomValidator) {
  }

  ngOnInit() {
  }

  errors() {
    if (this.beginValidate) {
      return this.validator.errors(this.column, this.model);
    }
  }

  hasError() {
    const hasError = this.validator.hasError(this.column, this.model);
    this.valid.emit(!hasError);
    return hasError;
  }

}
