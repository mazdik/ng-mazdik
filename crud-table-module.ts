import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {PaginationComponent} from './pagination/pagination.component';
import {ModalComponent} from './modal/modal.component';
import {HeaderComponent} from './header/header.component';
import {FilterComponent} from './filter/filter.component';
import {SearchFilterPipe} from './filter/search-filter.pipe';
import {DetailViewComponent} from './detail-view/detail-view.component';
import {FormComponent} from './form/form.component';
import {CrudTableComponent} from './crud-table.component';
import {LoadingIndicatorComponent} from './loading-indicator/loading-indicator.component';
import {BodyComponent} from './body/body.component';
import {BodyRowComponent} from './body/body-row.component';
import {BodyCellComponent} from './body/body-cell.component';
import {ScrollerComponent} from './body/scroller.component';
import {FooterComponent} from './footer/footer.component';
import {DatatableComponent} from './datatable/datatable.component';
import {TreeViewComponent} from './tree-view/tree-view.component';
import {ResizeableDirective} from './directives/resizeable.directive';
import {TreeTableComponent} from './tree-table/tree-table.component';
import {TreeTableNodeComponent} from './tree-table/tree-table-node.component';
import {NguiDatetimePickerModule} from './datetime-picker';
import {MainService} from './services/main.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NguiDatetimePickerModule,
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
    BodyRowComponent,
    BodyCellComponent,
    ResizeableDirective,
    ScrollerComponent,
    FooterComponent,
    DatatableComponent,
    TreeViewComponent,
    TreeTableComponent,
    TreeTableNodeComponent
  ],
  exports: [DatatableComponent, CrudTableComponent, TreeTableComponent, TreeViewComponent],
  providers: [MainService]
})
export class CrudTableModule {
}
