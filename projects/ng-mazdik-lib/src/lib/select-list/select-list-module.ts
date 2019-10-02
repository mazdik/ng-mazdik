import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FilterPipeModule} from '../pipes/filter.pipe';
import {SelectListComponent} from './select-list.component';

@NgModule({
  imports: [
    CommonModule,
    FilterPipeModule,
  ],
  declarations: [
    SelectListComponent,
  ],
  exports: [
    SelectListComponent,
  ]
})
export class SelectListModule {}
