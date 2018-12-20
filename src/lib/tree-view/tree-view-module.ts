import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {TreeViewComponent} from './tree-view.component';
import {TreeViewNodeComponent} from './tree-view-node.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
