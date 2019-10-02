import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectListModule} from '../select-list/select-list-module';
import {DropdownSelectComponent} from './dropdown-select.component';

@NgModule({
  imports: [
    CommonModule,
    SelectListModule,
  ],
  declarations: [
    DropdownSelectComponent,
  ],
  exports: [
    DropdownSelectComponent,
  ]
})
export class DropdownSelectModule {}
