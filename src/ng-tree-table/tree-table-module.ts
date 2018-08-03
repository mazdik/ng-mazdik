import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DataTableModule} from '../ng-data-table';
import {TreeTableComponent} from './components/tree-table/tree-table.component';
import {TreeTableNodeComponent} from './components/tree-table/tree-table-node.component';

@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
  ],
  declarations: [
    TreeTableComponent,
    TreeTableNodeComponent,
  ],
  exports: [
    TreeTableComponent,
  ],
  providers: []
})
export class TreeTableModule {
}
