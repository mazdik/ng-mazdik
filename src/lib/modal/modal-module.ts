import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalComponent} from './modal.component';
import {ResizableModule} from '../resizable';

@NgModule({
  imports: [
    CommonModule,
    ResizableModule,
  ],
  declarations: [
    ModalComponent,
  ],
  exports: [
    ModalComponent,
  ],
  providers: []
})
export class ModalModule {}
