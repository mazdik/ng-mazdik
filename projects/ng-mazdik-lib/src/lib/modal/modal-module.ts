import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalComponent} from './modal.component';
import {ResizableModule} from '../resizable/resizable-module';
import {DraggableModule} from '../draggable/draggable-module';

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
  ]
})
export class ModalModule {}
