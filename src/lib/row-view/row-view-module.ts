import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RowViewComponent} from './row-view.component';
import {OrderPipe} from './order.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    RowViewComponent,
    OrderPipe,
  ],
  exports: [
    RowViewComponent,
  ],
  providers: []
})
export class RowViewModule {}
