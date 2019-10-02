import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotifyComponent} from './notify.component';
import {NotifyItemComponent} from './notify-item.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    NotifyComponent,
    NotifyItemComponent,
  ],
  exports: [
    NotifyComponent,
  ]
})
export class NotifyModule {}
