import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {Column} from '../types/interfaces';
import {CustomValidator} from './custom-validator';


@Component({
  selector: 'app-form-calendar',
  template: `
    <div class="form-group" [ngClass]="{'has-error':hasError()}">
      <label [attr.for]="column.name">{{column.title}}</label>

      <div class="form-group">
        <div class='input-group date' style="width: 250px">
          <input type='text' class="form-control" [(ngModel)]="model" ngui-datetime-picker />
          <span class="input-group-addon">
             <span class="glyphicon glyphicon-calendar"></span>
          </span>
        </div>
      </div>

      <div class="help-block">
        <span *ngFor="let err of errors()">{{err}}<br></span>
      </div>
    </div>
  `
})
export class CalendarComponent implements OnInit {

  @Input() public column: Column;
  @Input() public dependsValue: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

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
    return this.validator.hasError(this.column, this.model);
  }

}
