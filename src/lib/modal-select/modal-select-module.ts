import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ModalModule} from '../modal';
import {PaginationModule} from '../pagination';
import {ModalSelectComponent} from './modal-select.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    PaginationModule,
  ],
  declarations: [
    ModalSelectComponent,
  ],
  exports: [
    ModalSelectComponent,
  ],
  providers: []
})
export class ModalSelectModule {}
