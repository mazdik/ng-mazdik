import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {PaginationComponent} from './components/pagination/pagination.component';
import {ModalComponent} from './components/modal/modal.component';
import {HeaderComponent} from './components/header/header.component';
import {FilterComponent} from './components/filter/filter.component';
import {FilterPipe} from './pipes/filter.pipe';
import {OrderPipe} from './pipes/order.pipe';
import {StringFilterComponent} from './components/filter/string-filter.component';
import {ListFilterComponent} from './components/filter/list-filter.component';
import {RangeFilterComponent} from './components/filter/range-filter.component';
import {FormComponent} from './components/form/form.component';
import {CrudTableComponent} from './components/crud-table/crud-table.component';
import {BodyComponent} from './components/body/body.component';
import {BodyRowComponent} from './components/body/body-row.component';
import {BodyCellComponent} from './components/body/body-cell.component';
import {BodyCellEditComponent} from './components/body/body-cell-edit.component';
import {BodyCellActionComponent} from './components/body/body-cell-action.component';
import {BodyScrollDirective} from './directives/body-scroll.directive';
import {DataTableComponent} from './components/data-table/data-table.component';
import {ResizeableColumnDirective} from './directives/resizeable-column.directive';
import {TreeTableComponent} from './components/tree-table/tree-table.component';
import {TreeTableNodeComponent} from './components/tree-table/tree-table-node.component';
import {ModalEditFormComponent} from './components/modal-edit-form/modal-edit-form.component';
import {InputComponent} from './components/form/input.component';
import {InputOptionComponent} from './components/form/input-option.component';
import {SelectComponent} from './components/form/select.component';
import {CheckboxComponent} from './components/form/checkbox.component';
import {RadioComponent} from './components/form/radio.component';
import {InputTextComponent} from './components/form/input-text.component';
import {TextareaComponent} from './components/form/textarea.component';
import {CalendarComponent} from './components/form/calendar.component';
import {ModalSelectComponent} from './components/modal-select/modal-select.component';
import {PopupSelectComponent} from './components/form/select-popup.component';
import {SummaryRowComponent} from './components/body/summary-row.component';
import {RowViewComponent} from './components/row-view/row-view.component';
import {BodyMouseoverDirective} from './directives/body-mouseover.directive';
import {BodyKeydownDirective} from './directives/body-keydown.directive';
import {BodyClickDirective} from './directives/body-click.directive';
import {BodyDblClickDirective} from './directives/body-dblclick.directive';
import {AfterViewFocusDirective} from './directives/after-view-focus-directory';
import {BodyContextMenuDirective} from './directives/body-contextmenu.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
  ],
  declarations: [
    CrudTableComponent,
    PaginationComponent,
    ModalComponent,
    HeaderComponent,
    FilterComponent,
    FilterPipe,
    OrderPipe,
    StringFilterComponent,
    ListFilterComponent,
    RangeFilterComponent,
    FormComponent,
    BodyComponent,
    BodyRowComponent,
    BodyCellComponent,
    BodyCellEditComponent,
    BodyCellActionComponent,
    BodyScrollDirective,
    ResizeableColumnDirective,
    DataTableComponent,
    TreeTableComponent,
    TreeTableNodeComponent,
    ModalEditFormComponent,
    InputComponent,
    InputOptionComponent,
    SelectComponent,
    CheckboxComponent,
    RadioComponent,
    InputTextComponent,
    TextareaComponent,
    CalendarComponent,
    ModalSelectComponent,
    PopupSelectComponent,
    SummaryRowComponent,
    RowViewComponent,
    BodyMouseoverDirective,
    BodyKeydownDirective,
    BodyClickDirective,
    BodyDblClickDirective,
    AfterViewFocusDirective,
    BodyContextMenuDirective,
  ],
  exports: [
    DataTableComponent,
    CrudTableComponent,
    TreeTableComponent,
    ModalComponent,
    ModalEditFormComponent,
  ],
  providers: []
})
export class CrudTableModule {
}
