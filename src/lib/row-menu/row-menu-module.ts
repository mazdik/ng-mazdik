import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RowMenuComponent} from './row-menu.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    RowMenuComponent,
  ],
  exports: [
    RowMenuComponent,
  ],
  providers: []
})
export class RowMenuModule {}
