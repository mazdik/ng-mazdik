import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PaginationComponent } from './pagination/pagination.component';
import { ModalComponent } from './modal/modal.component';
import { HeaderComponent } from './header/header.component';
import { FilterComponent } from './filter/filter.component';
import { SearchFilterPipe } from './filter/search-filter.pipe';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { FormComponent } from './form/form.component';
import { CrudTableComponent } from './crud-table.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { BodyComponent } from './body/body.component';
import { TreeViewModule } from './tree-view';
import { ResizeableDirective } from './directives/resizeable.directive';


@NgModule({
  imports: [
  	CommonModule,
    FormsModule,
    TreeViewModule
  ],
  declarations: [
	CrudTableComponent, 
	PaginationComponent, 
	ModalComponent, 
	HeaderComponent, 
	FilterComponent,
	DetailViewComponent,
	FormComponent,
	SearchFilterPipe,
	LoadingIndicatorComponent,
	BodyComponent,
	ResizeableDirective
  ],
  exports: [CrudTableComponent],
  providers: []
})
export class CrudTableModule {
}