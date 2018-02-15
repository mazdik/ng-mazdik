import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DemoCrudTableComponent } from './demo-crud-table.component';
import { CrudTableModule } from '../../ng-crud-table';
import { BasicDemoComponent } from './basic-demo.component';
import { TreeTableDemoComponent } from './tree-table-demo.component';
import { DataTableDemoComponent } from './data-table-demo.component';
import { MasterDetailDemoComponent } from './master-detail-demo.component';
import { ModalFormDemoComponent } from './modal-form-demo.component';
import { ModalDataTableDemoComponent } from './modal-data-table-demo.component';
import { NestedModalsDemoComponent} from './nested-modals-demo.component';
import { MultipleSortDemoComponent } from './multiple-sort-demo.component';
import { RowGroupDemoComponent } from './row-group-demo.component';
import { RowGroupMultipleDemoComponent } from './row-group-multiple-demo.component';
import { GlobalFilterDemoComponent } from './global-filter-demo.component';

@NgModule({
  declarations: [
    DemoCrudTableComponent,
    BasicDemoComponent,
    TreeTableDemoComponent,
    DataTableDemoComponent,
    MasterDetailDemoComponent,
    ModalFormDemoComponent,
    ModalDataTableDemoComponent,
    NestedModalsDemoComponent,
    MultipleSortDemoComponent,
    RowGroupDemoComponent,
    RowGroupMultipleDemoComponent,
    GlobalFilterDemoComponent
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
