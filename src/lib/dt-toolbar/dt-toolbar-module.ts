import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DtTranslateModule} from '../dt-translate';
import {DtToolbarComponent} from './dt-toolbar.component';
import {DtColumnTogglerModule} from '../dt-column-toggler';
import {DropdownModule} from '../dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DtTranslateModule.forChild(),
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
