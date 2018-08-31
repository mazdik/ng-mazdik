import {Component, Input, Output, OnInit, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {SelectOption, getOptionsFunction} from './types';
import {InputComponent} from './input.component';

@Component({
  selector: 'app-form-input-option',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOptionComponent extends InputComponent implements OnInit {

  @Input() getOptionsFunc: getOptionsFunction;
  @Output() keyColumnChange: EventEmitter<any> = new EventEmitter();
  @Output() loaded: EventEmitter<any> = new EventEmitter();

  @Input()
  set dependsValue(value) {
    if (this._dependsValue !== value) {
      this._dependsValue = value;
      this.setDependsOptions();
    }
  }

  get dependsValue() {
    return this._dependsValue;
  }

  private _options: SelectOption[];
  private _dependsValue: any;

  ngOnInit() {
    if (this.column.optionsUrl && !this.column.dependsColumn) {
      this.loadOptions();
    } else {
      this._options = this.column.getOptions(this.dependsValue);
    }
    this.validate();
  }

  setDependsOptions() {
    if (this.dependsValue) {
      if (this.column.optionsUrl) {
        this.loadOptions();
      } else {
        this._options = this.column.getOptions(this.dependsValue);
        this.setDefaultSelect();
      }
    } else {
      this._options = [];
    }
  }

  loadOptions() {
    if (this.column.optionsUrl && this.getOptionsFunc) {
      this.loading = true;
      this.getOptionsFunc(this.column.optionsUrl, this._dependsValue).then((res) => {
        this._options = res;
        this.loading = false;
        this.setDefaultSelect();
        this.loaded.emit();
      }).catch(error => {
        this._options = [];
        this.loading = false;
        this.loaded.emit();
      });
    }
  }

  getOptions() {
    return this._options;
  }

  onValueChange() {
    if (this.column.keyColumn) {
      this.keyColumnChange.emit({
        'column': this.column.keyColumn,
        'value': this.model
      });
    }
  }

  setDefaultSelect() {
    if (this._options && this._options.length === 1) {
      this.model = this._options[0].id;
      this.onValueChange();
    }
  }

}
