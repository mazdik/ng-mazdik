import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ModalSelectModule} from '../modal-select';
import {DropdownSelectModule} from '../dropdown-select';

import {DynamicFormComponent} from './dynamic-form.component';
import {InputComponent} from './input.component';
import {InputOptionComponent} from './input-option.component';
import {SelectComponent} from './select.component';
import {CheckboxComponent} from './checkbox.component';
import {RadioComponent} from './radio.component';
import {InputTextComponent} from './input-text.component';
import {TextareaComponent} from './textarea.component';
import {CalendarComponent} from './calendar.component';
import {SelectPopupComponent} from './select-popup.component';
import {SelectDropdownComponent} from './select-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalSelectModule,
    DropdownSelectModule,
  ],
  declarations: [
    DynamicFormComponent,
    InputComponent,
    InputOptionComponent,
    SelectComponent,
    CheckboxComponent,
    RadioComponent,
    InputTextComponent,
    TextareaComponent,
    CalendarComponent,
    SelectPopupComponent,
    SelectDropdownComponent,
  ],
  exports: [
    DynamicFormComponent,
  ],
  providers: []
})
export class DynamicFormModule {}
