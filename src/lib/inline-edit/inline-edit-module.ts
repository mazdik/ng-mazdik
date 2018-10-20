import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {InlineEditComponent} from './inline-edit.component';
import {AfterViewFocusDirective} from './after-view-focus-directory';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    InlineEditComponent,
    AfterViewFocusDirective,
  ],
  exports: [
    InlineEditComponent,
  ],
  providers: []
})
export class InlineEditModule {}
