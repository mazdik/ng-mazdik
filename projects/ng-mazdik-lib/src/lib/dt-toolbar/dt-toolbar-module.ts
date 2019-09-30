import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DtToolbarComponent} from './dt-toolbar.component';
import {DtColumnTogglerModule} from '../dt-column-toggler/dt-column-toggler.module';
import {DropdownModule} from '../dropdown/dropdown-module';

@NgModule({
  imports: [
    CommonModule,
    DtColumnTogglerModule,
    DropdownModule,
  ],
  declarations: [
    DtToolbarComponent,
  ],
  exports: [
    DtToolbarComponent,
  ]
})
export class DtToolbarModule {}
