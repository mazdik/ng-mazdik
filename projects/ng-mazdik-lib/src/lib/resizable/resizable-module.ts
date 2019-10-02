import {NgModule} from '@angular/core';
import {ResizableDirective} from './resizable.directive';

@NgModule({
  declarations: [
    ResizableDirective,
  ],
  exports: [
    ResizableDirective,
  ]
})
export class ResizableModule {}
