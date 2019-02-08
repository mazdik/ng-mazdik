import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FilterPipeModule} from '../pipes';
import {SelectListComponent} from './select-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
