import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ToolbarComponent} from './toolbar.component';
import {ExportCSV} from '../export/export-csv';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    ToolbarComponent,
  ],
  exports: [
    ToolbarComponent,
  ],
  providers: [ExportCSV]
})
export class ToolbarModule {}
