import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FilterPipeModule} from '../pipes';
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
  ],
  providers: []
})
export class SelectListModule {}
