import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, HostBinding} from '@angular/core';
import {SelectItem} from '../common';
import {inputFormattedDate} from '../common/utils';

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
  @Input() viewValue: string | number;
  @Input() selectPlaceholder: string;

  @Input()
  get value(): string | number { return this._value; }
  set value(value: string | number) {
    this._value = value;
    this.valueChange.emit(this._value);
  }
  private _value: string | number;

  @Output() valueChange: EventEmitter<string | number> = new EventEmitter();
  @Output() inputChange: EventEmitter<any> = new EventEmitter();
  @Output() focusChange: EventEmitter<any> = new EventEmitter();
  @Output() blurChange: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.dt-inline-editor') cssClass = true;

  get inputFormattedValue() {
    return inputFormattedDate(this.type, this.value);
  }

  constructor() {}

  onInput(event: any) {
    this.value = (this.type === 'number') ? parseFloat(event.target.value) : event.target.value;
  }

  onInputChange() {
    this.inputChange.emit();
  }

  onInputFocus() {
    this.focusChange.emit();
  }

  onInputBlur() {
    this.blurChange.emit();
  }

}
