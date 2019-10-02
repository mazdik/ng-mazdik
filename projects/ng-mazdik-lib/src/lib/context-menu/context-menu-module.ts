import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContextMenuComponent} from './context-menu.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ContextMenuComponent,
  ],
  exports: [
    ContextMenuComponent,
  ]
})
export class ContextMenuModule {}
