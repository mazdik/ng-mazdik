import {Component} from '@angular/core';
import {InputOptionComponent} from './input-option.component';

@Component({
  selector: 'app-form-checkbox',
  template: `
    <div class="df-group" [ngClass]="{'df-has-error':hasError()}">
      <label [attr.for]="column.name">{{column.title}}</label>
      <i class="icon-collapsing" *ngIf="loading"></i>
      <div *ngFor="let o of getOptions()">
        <label class="checkcontainer">{{o.name ? o.name : o.id}}
          <input
            type="checkbox"
            [(ngModel)]="model"
            [name]="column.name"
            [value]="o.id"
            [checked]="isSelectActive(o)"
            [disabled]="disabled"/>
          <span class="checkmark"></span>
        </label>
      </div>
      <div class="df-help-block">
        <span *ngFor="let err of errors">{{err}}<br></span>
      </div>
    </div>
  `
})
export class CheckboxComponent extends InputOptionComponent {

  isSelectActive(option) {
    if (Array.isArray(this.model)) {
      return this.model.find(a => a === option.id) ? true : false;
    } else {
      return this.model === option.id;
    }
  }

}
