import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CrudTableModule } from '../../src';
import { BasicDemoComponent } from './basic-demo.component';
import { TreeTableDemoComponent } from './tree-table-demo.component';
import { TreeFilterDemoComponent } from './tree-filter-demo.component';

@NgModule({
  declarations: [
    AppComponent,
    BasicDemoComponent,
    TreeTableDemoComponent,
    TreeFilterDemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CrudTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
