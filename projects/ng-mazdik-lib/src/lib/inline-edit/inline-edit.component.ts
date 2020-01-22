import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding} from '@angular/core';
import {SelectItem} from '../common';
import {inputFormattedDate, inputIsDateType, checkStrDate, isBlank} from '../common/utils';

@Component({
  selector: 'app-inline-edit, [inline-edit]',
  templateUrl: 'inline-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineEditComponent {

  @Input() value: string | number | Date;
  @Input() editing: boolean;
  @Input() type = 'text';
  @Input() options: SelectItem[];
  @Input() viewValue: string | number | Date;
  @Input() selectPlaceholder: string;

  @Output() valueChange: EventEmitter<string | number | Date> = new EventEmitter();
  @Output() inputChange: EventEmitter<any> = new EventEmitter();
  @Output() focusChange: EventEmitter<any> = new EventEmitter();
  @Output() blurChange: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.dt-inline-editor') cssClass = true;

  get isDateType(): boolean {
    return inputIsDateType(this.type);
  }

  get inputFormattedValue() {
    if (this.isDateType) {
      return inputFormattedDate(this.type, this.value);
    }
    return this.value;
  }

  constructor() {}

  onInput(event: any) {
    if (this.type === 'number') {
      this.value = !isBlank(event.target.value) ? parseFloat(event.target.value) : null;
    } else if (this.isDateType) {
      if (checkStrDate(event.target.value)) {
        this.value = new Date(event.target.value);
      }
    } else {
      this.value = event.target.value;
    }
    this.valueChange.emit(this.value);
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
