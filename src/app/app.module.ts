import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CrudTableModule } from '../ng-crud-table';
import { BasicDemoComponent } from './demo/basic-demo.component';
import { TreeTableDemoComponent } from './demo/tree-table-demo.component';
import { DataTableDemoComponent } from './demo/data-table-demo.component';
import { MasterDetailDemoComponent } from './demo/master-detail-demo.component';
import { ModalFormDemoComponent } from './demo/modal-form-demo.component';
import { ModalDataTableDemoComponent } from './demo/modal-data-table-demo.component';
import { NestedModalsDemoComponent} from './demo/nested-modals-demo.component';
import { MultipleSortDemoComponent } from './demo/multiple-sort-demo.component';
import { RowGroupDemoComponent } from './demo/row-group-demo.component';
import { RowGroupMultipleDemoComponent } from './demo/row-group-multiple-demo.component';
import { GlobalFilterDemoComponent } from './demo/global-filter-demo.component';
import { RowGroupSummaryDemoComponent } from './demo/row-group-summary-demo.component';
import { SummaryRowDemoComponent } from './demo/summary-row-demo.component';

@NgModule({
  declarations: [
    AppComponent,
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
    GlobalFilterDemoComponent,
    RowGroupSummaryDemoComponent,
    SummaryRowDemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CrudTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
