import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DragDropModule} from '../drag-drop/drag-drop-module';
import {DualListBoxComponent} from './dual-list-box.component';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
  ],
  declarations: [
    DualListBoxComponent,
  ],
  exports: [
    DualListBoxComponent,
  ]
})
export class DualListBoxModule {}
