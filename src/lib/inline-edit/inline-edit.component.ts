import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, HostBinding} from '@angular/core';
import {PipeTransform} from '@angular/core';
import {SelectItem} from '../common';
import {inputFormattedDate, isBlank} from '../common/utils';

@Component({
  selector: 'app-inline-edit, [inline-edit]',
  templateUrl: 'inline-edit.component.html',
  styleUrls: ['inline-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InlineEditComponent {

  @Input() editing: boolean;
  @Input() type = 'text';
  @Input() options: SelectItem[];
  @Input() pipe: PipeTransform;

  @Input()
  get value(): string | number { return this._value; }
  set value(value: string | number) {
    this._value = value;
    this.valueChange.emit(this._value);
  }
  private _value: string | number;

  @Output() valueChange: EventEmitter<string | number> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();
  @Output() blur: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.dt-inline-editor') cssClass = true;

  get viewValue() {
    let value = this.value;
    if (!isBlank(this.value) && this.options && this.options.length) {
      const option = this.options.find(x => x.id === this.value);
      value = (option) ? option.name : null;
    }
    if (this.pipe) {
      value = this.pipe.transform(value);
    }
    return value;
  }

  get inputFormattedValue() {
    return inputFormattedDate(this.type, this.value);
  }

  constructor() {
  }

  onInputChange() {
    this.change.emit();
  }

  onInputFocus() {
    this.focus.emit();
  }

  onInputBlur() {
    this.blur.emit();
  }

}
