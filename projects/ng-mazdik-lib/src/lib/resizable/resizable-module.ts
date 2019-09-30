import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResizableDirective} from './resizable.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ResizableDirective,
  ],
  exports: [
    ResizableDirective,
  ],
  providers: []
})
export class ResizableModule {}
