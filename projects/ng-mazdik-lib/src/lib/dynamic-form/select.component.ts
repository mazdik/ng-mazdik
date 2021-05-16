import { Component, ChangeDetectionStrategy } from '@angular/core';
import { InputOptionComponent } from './input-option.component';

@Component({
  selector: 'app-form-select',
  template: `
    <div class="dt-group" [ngClass]="{'dt-has-error':dynElement.hasError}">
      <label [attr.for]="dynElement.name">{{dynElement.title}}</label>
      <i class="dt-loader" *ngIf="loading"></i>
      <select class="dt-input"
              id="{{dynElement.name}}"
              (change)="onChangeSelect($event)"
              [disabled]="disabled">
        <option value="" disabled selected hidden>{{placeholder}}</option>
        <option *ngFor="let opt of getOptions()" [value]="opt.id" [selected]="(opt.id === model)">{{opt.name}}</option>
      </select>
      <div class="dt-help-block">
        <span *ngFor="let err of dynElement.errors">{{err}}<br></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent extends InputOptionComponent {

  onChangeSelect(event: Event): void {
    const element = event.target as HTMLSelectElement;
    this.model = element.value;
    this.onValueChange();
  }

}
