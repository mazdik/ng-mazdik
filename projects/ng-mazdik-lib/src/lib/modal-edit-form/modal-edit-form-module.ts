import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalModule} from '../modal';
import {RowViewModule} from '../row-view';
import {DynamicFormModule} from '../dynamic-form';
import {ModalEditFormComponent} from './modal-edit-form.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    RowViewModule,
    DynamicFormModule,
  ],
  declarations: [
    ModalEditFormComponent,
  ],
  exports: [
    ModalEditFormComponent,
  ],
  providers: []
})
export class ModalEditFormModule {}
