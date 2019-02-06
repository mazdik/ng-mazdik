import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DroppableDirective} from './droppable.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DroppableDirective,
  ],
  exports: [
    DroppableDirective,
  ]
})
export class DragDropModule {}
