import {NgModule} from '@angular/core';
import {DroppableDirective} from './droppable.directive';

@NgModule({
  declarations: [
    DroppableDirective,
  ],
  exports: [
    DroppableDirective,
  ]
})
export class DragDropModule {}
