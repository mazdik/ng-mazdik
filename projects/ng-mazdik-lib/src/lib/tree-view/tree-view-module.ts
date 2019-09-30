import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {TreeViewComponent} from './tree-view.component';
import {TreeViewNodeComponent} from './tree-view-node.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [
    TreeViewComponent,
    TreeViewNodeComponent,
  ],
  exports: [
    TreeViewComponent,
  ]
})
export class TreeViewModule {
}
