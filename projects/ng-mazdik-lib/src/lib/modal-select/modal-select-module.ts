import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ModalModule} from '../modal/modal-module';
import {PaginationModule} from '../pagination/pagination-module';
import {ModalSelectComponent} from './modal-select.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    PaginationModule,
  ],
  declarations: [
    ModalSelectComponent,
  ],
  exports: [
    ModalSelectComponent,
  ]
})
export class ModalSelectModule {}
