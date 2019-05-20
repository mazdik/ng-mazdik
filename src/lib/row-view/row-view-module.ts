import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderPipeModule} from '../pipes';
import {RowViewComponent} from './row-view.component';

@NgModule({
  imports: [
    CommonModule,
    OrderPipeModule,
  ],
  declarations: [
    RowViewComponent,
  ],
  exports: [
    RowViewComponent,
  ],
  providers: []
})
export class RowViewModule {}
