import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScrollerComponent} from './scroller.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ScrollerComponent,
  ],
  exports: [
    ScrollerComponent,
  ]
})
export class ScrollerModule {}
