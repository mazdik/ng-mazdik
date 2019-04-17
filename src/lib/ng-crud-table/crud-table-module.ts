import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {DataTableModule} from '../ng-data-table';
import {DtToolbarModule} from '../dt-toolbar';
import {NotifyModule} from '../notify';
import {ModalEditFormModule} from '../modal-edit-form';
import {ContextMenuModule} from '../context-menu';
import {CrudTableComponent} from './components/crud-table/crud-table.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    DataTableModule,
    DtToolbarModule,
    NotifyModule,
    ModalEditFormModule,
    ContextMenuModule,
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
