import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PaginationComponent } from './pagination/pagination.component';
import { ModalComponent } from './modal/modal.component';
import { HeaderComponent } from './header/header.component';
import { FilterComponent } from './filter/filter.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { FormComponent } from './form/form.component';
import { CrudTableComponent } from './crud-table.component';
import { CrudService } from './services/crud.service';
import { SelectComponent, SelectSearchFilter } from './select/select.component';

@NgModule({
  imports: [
  	CommonModule,
    FormsModule
  ],
  declarations: [
	CrudTableComponent, 
	PaginationComponent, 
	ModalComponent, 
	HeaderComponent, 
  FilterComponent,
  DetailViewComponent,
  FormComponent,
	SelectComponent, 
	SelectSearchFilter
  ],
  exports: [CrudTableComponent],
  providers: [CrudService]
})
export class CrudTableModule {
}