import {Component, Input, Output, OnInit, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {GetOptionsFunc, KeyElementChangeEventArgs} from './types';
import {InputComponent} from './input.component';
import {SelectItem} from '../common';

@Component({
  selector: 'app-form-input-option',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOptionComponent extends InputComponent implements OnInit {

  @Input() getOptionsFunc: GetOptionsFunc;
  @Input() searchInputPlaceholder: string;
  @Output() keyElementChange: EventEmitter<KeyElementChangeEventArgs> = new EventEmitter();
  @Output() loaded: EventEmitter<any> = new EventEmitter();

  @Input()
  get dependsValue(): any { return this._dependsValue; }
  set dependsValue(value: any) {
    if (this._dependsValue !== value) {
      this._dependsValue = value;
      this.setDependsOptions();
    }
  }
  private _dependsValue: any;

  private _options: SelectItem[];
  private firstCascade: boolean = true;

  ngOnInit() {
    if (this.dynElement.optionsUrl && !this.dynElement.dependsElement) {
      this.loadOptions();
    } else {
      this._options = this.dynElement.getOptions(this.dependsValue);
    }
    this.validate();
  }

  setDependsOptions() {
    if (this.dependsValue) {
      if (this.dynElement.optionsUrl) {
        this.loadOptions();
      } else {
        this._options = this.dynElement.getOptions(this.dependsValue);
        this.setDefaultSelect();
      }
    } else {
      this._options = [];
    }
  }

  loadOptions() {
    if (this.dynElement.optionsUrl && this.getOptionsFunc) {
      this.loading = true;
      this.getOptionsFunc(this.dynElement.optionsUrl, this._dependsValue).then((res) => {
        this._options = res;
        this.setDefaultSelect();
        this.loaded.emit();
      }).catch(error => {
        this._options = [];
        this.loaded.emit();
      }).finally(() => this.loading = false);
    }
  }

  getOptions(): SelectItem[] {
    return this._options;
  }

  onValueChange() {
    if (this.dynElement.keyElement) {
      this.keyElementChange.emit({
        keyElementName: this.dynElement.keyElement,
        keyElementValue: this.model,
        elementName: this.dynElement.name,
        elementValue: this.getName(),
      });
    }
  }

  setDefaultSelect() {
    const initValueOnEdit = (this.firstCascade && this.model !== null && this.model !== undefined && this.model.length !== 0);
    if (!initValueOnEdit) {
      this.model = '';
      if (this._options && this._options.length === 1) {
        this.model = this._options[0].id;
      }
      this.onValueChange();
    }
    this.firstCascade = false;
  }

  getName() {
    if (this._options) {
      const option = this._options.find(x => x.id === this.model);
      return (option) ? option.name : '';
    }
  }

}
