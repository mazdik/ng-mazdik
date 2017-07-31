import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {TreeViewComponent, TreeNodeComponent} from './tree-view.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [TreeViewComponent, TreeNodeComponent],
  exports: [TreeViewComponent],
  providers: []
})
export class TreeViewModule {

}
