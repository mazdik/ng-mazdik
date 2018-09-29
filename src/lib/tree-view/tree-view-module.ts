import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {TreeViewComponent} from './tree-view.component';
import {TreeViewNodeComponent} from './tree-view-node.component';
import {Tree} from '../tree';

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
  ],
  providers: [Tree]
})
export class TreeViewModule {
}
