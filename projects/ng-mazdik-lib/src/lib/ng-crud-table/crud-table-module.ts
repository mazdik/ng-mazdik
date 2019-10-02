import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {DataTableModule} from '../ng-data-table/data-table-module';
import {DtToolbarModule} from '../dt-toolbar/dt-toolbar-module';
import {NotifyModule} from '../notify/notify-module';
import {ModalEditFormModule} from '../modal-edit-form/modal-edit-form-module';
import {ContextMenuModule} from '../context-menu/context-menu-module';
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
  ]
})
export class CrudTableModule {}
