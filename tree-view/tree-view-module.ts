import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TreeView, TreeNode } from './tree-view.component';

@NgModule({
  imports: [
  	CommonModule,
  ],
  declarations: [TreeView, TreeNode],
  exports: [TreeView],
  providers: []
})
export class TreeViewModule {

}