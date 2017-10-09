import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {Column} from '../types/interfaces';
import {ColumnUtils} from '../utils/column-utils';
import {CustomValidator} from './custom-validator';


@Component({
  selector: 'app-form-dropdown',
  template: `
    <div class="form-group" [ngClass]="{'has-error':hasError()}">
      <label [attr.for]="column.name">{{column.title}}</label>

      <select class="form-control"
              [(ngModel)]="model"
              (focus)="beginValidate = true"
              [id]="column.name">
        <option *ngFor="let opt of getOptions()" [value]="opt.id">{{opt.name}}</option>
      </select>

      <div class="help-block">
        <span *ngFor="let err of errors()">{{err}}<br></span>
      </div>
    </div>
  `
})
export class DropdownComponent implements OnInit {

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
