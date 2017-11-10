import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DemoCrudTableComponent } from './demo-crud-table.component';
import { CrudTableModule } from '../../ng-crud-table';
import { BasicDemoComponent } from './basic-demo.component';
import { TreeTableDemoComponent } from './tree-table-demo.component';
import { TreeFilterDemoComponent } from './tree-filter-demo.component';
import { DataTableDemoComponent } from './data-table-demo.component';
import { MasterDetailDemoComponent } from './master-detail.component';
import { ModalFormDemoComponent} from './modal-form-demo.component';

@NgModule({
  declarations: [
    DemoCrudTableComponent,
    BasicDemoComponent,
    TreeTableDemoComponent,
    TreeFilterDemoComponent,
    DataTableDemoComponent,
    MasterDetailDemoComponent,
    ModalFormDemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CrudTableModule,
  ],
  providers: [],
  exports: [DemoCrudTableComponent],
})
export class DemoCrudTableModule { }
