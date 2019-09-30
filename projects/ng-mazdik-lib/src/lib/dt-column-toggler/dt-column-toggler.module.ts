import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtColumnTogglerComponent } from './dt-column-toggler.component';
import { DualListBoxModule } from '../dual-list-box/dual-list-box-module';
import { ModalModule } from '../modal/modal-module';

@NgModule({
  imports: [
    CommonModule,
    DualListBoxModule,
    ModalModule,
  ],
  declarations: [
    DtColumnTogglerComponent
  ],
  exports: [
    DtColumnTogglerComponent,
  ]
})
export class DtColumnTogglerModule { }
