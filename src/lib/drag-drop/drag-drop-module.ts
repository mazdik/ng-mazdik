import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropElementDirective} from './drop-element.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DropElementDirective,
  ],
  exports: [
    DropElementDirective,
  ]
})
export class DragDropModule {}
