import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavMenuComponent } from './nav-menu.component';
import { NavItemComponent } from './nav-item.component';

@NgModule({
  declarations: [
    NavMenuComponent,
    NavItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    NavMenuComponent,
  ],
})
export class NavMenuModule { }
