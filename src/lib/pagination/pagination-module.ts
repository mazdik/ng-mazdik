import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginationComponent} from './pagination.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PaginationComponent,
  ],
  exports: [
    PaginationComponent,
  ],
  providers: []
})
export class PaginationModule {}
