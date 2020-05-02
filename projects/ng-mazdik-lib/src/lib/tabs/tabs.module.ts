import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';

@NgModule({
  declarations: [TabsComponent],
  exports: [TabsComponent],
  imports: [CommonModule]
})
export class TabsModule { }
