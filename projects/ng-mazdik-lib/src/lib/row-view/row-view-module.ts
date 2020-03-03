import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RowViewComponent} from './row-view.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    RowViewComponent,
  ],
  exports: [
    RowViewComponent,
  ]
})
export class RowViewModule {}
