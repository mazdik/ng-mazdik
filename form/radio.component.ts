import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {Column} from '../types/interfaces';
import {ColumnUtils} from '../utils/column-utils';
import {CustomValidator} from './custom-validator';


@Component({
  selector: 'app-form-radio',
  template: `
    <div class="form-group" [ngClass]="{'has-error':hasError()}">
      <label [attr.for]="column.name">{{column.title}}</label>

      <div class="radio" *ngFor="let o of getOptions()">
        <label>
          <input
            type="radio"
            [(ngModel)]="model"
            [name]="column.name"
            [value]="o.id"
            [checked]="model === o.id"
            (click)="model = o.id"/>
        </label>
        <span>{{o.name ? o.name : o.id}}</span>
      </div>

      <div class="help-block">
        <span *ngFor="let err of errors()">{{err}}<br></span>
      </div>
    </div>
  `
})
export class RadioComponent implements OnInit {

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

  getOptions() {
    return ColumnUtils.getOptions(this.column, this.dependsValue);
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
