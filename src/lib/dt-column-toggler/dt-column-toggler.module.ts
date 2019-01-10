import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtColumnTogglerComponent } from './dt-column-toggler.component';
import { DualListBoxModule } from '../dual-list-box';
import { ModalModule } from '../modal';
import { DtTranslateModule } from '../dt-translate';

@NgModule({
  imports: [
    CommonModule,
    DualListBoxModule,
    ModalModule,
    DtTranslateModule.forChild(),
  ],
  declarations: [
    DtColumnTogglerComponent
  ],
  exports: [
    DtColumnTogglerComponent,
  ]
})
export class DtColumnTogglerModule { }
