import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DtTranslateModule} from '../dt-translate';
import {ContextMenuComponent} from './context-menu.component';

@NgModule({
  imports: [
    CommonModule,
    DtTranslateModule.forChild(),
  ],
  declarations: [
    ContextMenuComponent,
  ],
  exports: [
    ContextMenuComponent,
  ],
  providers: []
})
export class ContextMenuModule {}
