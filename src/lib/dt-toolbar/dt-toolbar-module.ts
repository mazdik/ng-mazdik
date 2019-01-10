import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DtTranslateModule} from '../dt-translate';
import {DtToolbarComponent} from './dt-toolbar.component';
import {ExportCSV} from '../export/export-csv';
import {DtColumnTogglerModule} from '../dt-column-toggler';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DtTranslateModule.forChild(),
    DtColumnTogglerModule,
  ],
  declarations: [
    DtToolbarComponent,
  ],
  exports: [
    DtToolbarComponent,
  ],
  providers: [ExportCSV]
})
export class DtToolbarModule {}
