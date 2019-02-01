import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DraggableModule} from '../draggable';
import {DragObjectDirective} from './drag-object.directive';

@NgModule({
  imports: [
    CommonModule,
    DraggableModule,
  ],
  declarations: [
    DragObjectDirective,
  ],
  exports: [
    DragObjectDirective,
  ],
  providers: []
})
export class DragDropModule {}
