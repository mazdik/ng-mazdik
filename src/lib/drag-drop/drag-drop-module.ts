import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DraggableModule} from '../draggable';
import {DragObjectDirective} from './drag-object.directive';
import {DropElementDirective} from './drop-element.directive';

@NgModule({
  imports: [
    CommonModule,
    DraggableModule,
  ],
  declarations: [
    DragObjectDirective,
    DropElementDirective,
  ],
  exports: [
    DragObjectDirective,
    DropElementDirective,
  ],
  providers: []
})
export class DragDropModule {}
