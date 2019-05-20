import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DragDropModule} from '../drag-drop';
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
  ],
  providers: []
})
export class DualListBoxModule {}
