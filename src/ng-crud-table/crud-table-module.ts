import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {DataTableModule} from '../ng-data-table';
import {ToolbarModule} from '../lib/toolbar';
import {MessageModule} from '../lib/message';
import {ModalEditFormModule} from '../lib/modal-edit-form';
import {RowMenuModule} from '../lib/row-menu';
import {CrudTableComponent} from './components/crud-table/crud-table.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    DataTableModule,
    ToolbarModule,
    MessageModule,
    ModalEditFormModule,
    RowMenuModule,
  ],
  declarations: [
    CrudTableComponent,
  ],
  exports: [
    CrudTableComponent,
  ],
  providers: []
})
export class CrudTableModule {}
