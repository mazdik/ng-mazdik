import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InlineEditComponent} from './inline-edit.component';
import {AfterViewFocusDirective} from './after-view-focus-directory';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    InlineEditComponent,
    AfterViewFocusDirective,
  ],
  exports: [
    InlineEditComponent,
  ]
})
export class InlineEditModule {}
