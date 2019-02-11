import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DataTableModule} from '../ng-data-table';
import {TreeTableComponent} from './components/tree-table/tree-table.component';

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
  ],
  providers: []
})
export class TreeTableModule {}
