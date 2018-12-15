import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {DataTableModule} from '../ng-data-table';
import {ToolbarModule} from '../lib/toolbar';
import {NotifyModule} from '../lib/notify';
import {ModalEditFormModule} from '../lib/modal-edit-form';
import {ContextMenuModule} from '../lib/context-menu';
import {DtTranslateModule} from '../lib/dt-translate';
import {CrudTableComponent} from './components/crud-table/crud-table.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    DataTableModule,
    ToolbarModule,
    NotifyModule,
    ModalEditFormModule,
    ContextMenuModule,
    DtTranslateModule.forChild(),
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
