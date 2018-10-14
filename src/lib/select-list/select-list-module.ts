import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SelectListComponent} from './select-list.component';
import {FilterPipe} from './filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    SelectListComponent,
    FilterPipe,
  ],
  exports: [
    SelectListComponent,
  ],
  providers: []
})
export class SelectListModule {}
