import {Component, ChangeDetectionStrategy} from '@angular/core';
import {InputOptionComponent} from './input-option.component';

@Component({
  selector: 'app-form-select-dropdown',
  template: `
    <div class="dt-group" [ngClass]="{'dt-has-error':hasError()}">
      <label [attr.for]="dynElement.name">{{dynElement.title}}</label>
      <i class="dt-loader" *ngIf="loading"></i>
      <app-dropdown-select [value]="model"
                           [options]="getOptions()"
                           [disabled]="disabled"
                           [placeholder]="placeholder"
                           [searchInputPlaceholder]="searchInputPlaceholder"
                           (valueChange)="model=$event; onValueChange()">
      </app-dropdown-select>
      <div class="dt-help-block">
        <span *ngFor="let err of errors">{{err}}<br></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDropdownComponent extends InputOptionComponent {

}
