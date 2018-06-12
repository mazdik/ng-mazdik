import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {Column} from '../base';

@Component({
  selector: 'app-form-input',
  template: ``
})
export class InputComponent implements OnInit {

  @Input() public column: Column;
  @Input() public disabled: boolean;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Output() valid: EventEmitter<boolean> = new EventEmitter();

  @Input('value')
  set model(value) {
    if (this._model !== value) {
      this._model = value;
      this.valueChange.emit(this._model);
      this.validate();
    }
  }

  get model() {
    return this._model;
  }

  public errors: any[] = [];
  public loading: boolean;

  private _model: any;

  constructor() {
  }

  ngOnInit() {
    this.validate();
  }

  validate() {
    this.errors = this.column.validate(this.model);
  }

  hasError() {
    const hasError = this.errors.length > 0;
    this.valid.emit(!hasError);
    return hasError;
  }

}
