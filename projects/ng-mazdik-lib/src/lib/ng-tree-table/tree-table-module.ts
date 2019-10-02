import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DataTableModule} from '../ng-data-table/data-table-module';
import {TreeTableComponent} from './tree-table.component';

@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
  ],
  declarations: [
    TreeTableComponent,
  ],
  exports: [
    TreeTableComponent,
  ]
})
export class TreeTableModule {}
