import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { DemoCrudTableComponent } from './demo-crud-table.component';
import { CrudTableModule } from '../crud-table-module';
import { BasicDemoComponent } from './basic-demo.component';
import { TreeTableDemoComponent } from './tree-table-demo.component';
import { TreeFilterDemoComponent } from './tree-filter-demo.component';
import { DataTableDemoComponent } from './data-table-demo.component';

@NgModule({
  declarations: [
    DemoCrudTableComponent,
    BasicDemoComponent,
    TreeTableDemoComponent,
    TreeFilterDemoComponent,
    DataTableDemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CrudTableModule,
  ],
  providers: [],
  exports: [DemoCrudTableComponent],
})
export class DemoCrudTableModule { }
