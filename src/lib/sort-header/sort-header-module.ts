import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SortHeaderComponent} from './sort-header.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SortHeaderComponent,
  ],
  exports: [
    SortHeaderComponent,
  ],
  providers: []
})
export class SortHeaderModule {}
