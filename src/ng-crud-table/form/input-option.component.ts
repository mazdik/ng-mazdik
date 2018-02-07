import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {DataSource} from '../types';
import {InputComponent} from './input.component';

@Component({
  selector: 'app-form-input-option',
  template: ``
})
export class InputOptionComponent extends InputComponent implements OnInit {

  @Input() public service: DataSource;
  @Output() keyColumnChange: EventEmitter<any> = new EventEmitter();

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

  private _options: any;
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
      }
    } else {
      this._options = [];
    }
  }

  loadOptions() {
    if (this.column.optionsUrl && this.service.getOptions) {
      this.loading = true;
      this.service.getOptions(this.column.optionsUrl, this._dependsValue).then((res) => {
        this._options = res;
        this.loading = false;
      }).catch(error => {
        this._options = [];
        this.loading = false;
      });
    }
  }

  getOptions() {
    return this._options;
  }

  onValueChange(event) {
    if (this.column.keyColumn) {
      this.keyColumnChange.emit({
        'column': this.column.keyColumn,
        'value': this.model
      });
    }
  }

}
