import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalComponent} from './modal.component';
import {ResizableModule} from '../resizable';
import {DraggableModule} from '../draggable';

@NgModule({
  imports: [
    CommonModule,
    ResizableModule,
    DraggableModule,
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
