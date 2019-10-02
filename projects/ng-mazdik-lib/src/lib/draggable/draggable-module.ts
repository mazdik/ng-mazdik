import {NgModule} from '@angular/core';
import {DraggableDirective} from './draggable.directive';

@NgModule({
  declarations: [
    DraggableDirective,
  ],
  exports: [
    DraggableDirective,
  ]
})
export class DraggableModule {}
