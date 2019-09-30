import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DraggableDirective} from './draggable.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DraggableDirective,
  ],
  exports: [
    DraggableDirective,
  ],
  providers: []
})
export class DraggableModule {}
