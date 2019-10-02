import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalModule} from '../modal/modal-module';
import {RowViewModule} from '../row-view/row-view-module';
import {DynamicFormModule} from '../dynamic-form/dynamic-form-module';
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
  ]
})
export class ModalEditFormModule {}
