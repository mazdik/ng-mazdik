import {Component, Input, Output, OnInit, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {DynamicFormElement} from './dynamic-form-element';

@Component({
  selector: 'app-form-input',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements OnInit {

  @Input() dynElement: DynamicFormElement;
  @Input() disabled: boolean;
  @Input() placeholder: string;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Output() valid: EventEmitter<boolean> = new EventEmitter();

  @Input('value')
  get model(): any { return this._model; }
  set model(value: any) {
    if (this._model !== value) {
      this._model = value;
      this.valueChange.emit(this._model);
      this.validate();
    }
  }
  private _model: any;

  errors: any[] = [];
  loading: boolean;

  constructor() {}

  ngOnInit() {
    this.validate();
  }

  validate() {
    this.errors = this.dynElement.validate(this.model);
  }

  hasError() {
    const hasError = (this.errors && this.errors.length > 0);
    this.valid.emit(!hasError);
    return hasError;
  }

}
