import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {ColumnModel, ICrudService} from '../types';
import {CustomValidator} from './custom-validator';


@Component({
  selector: 'app-form-radio',
  template: `
    <div class="df-group" [ngClass]="{'df-has-error':hasError()}">
      <label [attr.for]="column.name">{{column.title}}</label>
      <i class="icon-collapsing" *ngIf="loading"></i>
      <div *ngFor="let o of getOptions()">
        <label class="checkcontainer">{{o.name ? o.name : o.id}}
          <input
            type="radio"
            [(ngModel)]="model"
            [name]="column.name"
            [value]="o.id"
            [checked]="model === o.id"
            (click)="model = o.id"
            [disabled]="disabled"/>
          <span class="radiobtn"></span>
        </label>
      </div>
      <div class="df-help-block">
        <span *ngFor="let err of errors()">{{err}}<br></span>
      </div>
    </div>
  `
})
export class RadioComponent implements OnInit {

  @Input() public column: ColumnModel;
  @Input() public disabled: boolean;
  @Input() public service: ICrudService;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Output() valid: EventEmitter<boolean> = new EventEmitter();

  @Input('value')
  set model(value) {
    if (this._model !== value) {
      this._model = value;
      this.valueChange.emit(this._model);
    }
  }

  @Input()
  set dependsValue(value) {
    if (this._dependsValue !== value) {
      this._dependsValue = value;
      this.setDependsOptions();
    }
  }

  get model() {
    return this._model;
  }

  get dependsValue() {
    return this._dependsValue;
  }

  private _model: any;
  private _options: any;
  private _dependsValue: any;
  public beginValidate: boolean;
  public loading: boolean = false;

  constructor(private validator: CustomValidator) {
  }

  ngOnInit() {
    if (this.column.optionsUrl && !this.column.dependsColumn) {
      this.loadOptions();
    } else {
      this._options = this.column.getOptions(this.dependsValue);
    }
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
