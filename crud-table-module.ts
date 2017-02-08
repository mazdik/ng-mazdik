import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PaginationComponent } from './pagination.component';
import { ModalComponent } from './modal.component';
import { CrudTableComponent } from './crud-table.component';
import { CrudService } from './crud.service';

@NgModule({
  imports: [
  	CommonModule,
    FormsModule
  ],
  declarations: [CrudTableComponent, PaginationComponent, ModalComponent],
  exports: [CrudTableComponent],
  providers: [CrudService]
})
export class CrudTableModule {
}