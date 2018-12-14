import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RowMenuComponent} from './row-menu.component';
import {DtTranslateModule} from '../dt-translate';

@NgModule({
  imports: [
    CommonModule,
    DtTranslateModule.forChild(),
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
