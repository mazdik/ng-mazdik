import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavMenuComponent } from './nav-menu.component';
import { NavItemComponent } from './nav-item.component';

@NgModule({
  declarations: [
    NavMenuComponent,
    NavItemComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NavMenuComponent,
  ],
})
export class NavMenuModule { }
