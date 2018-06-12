import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {PaginationComponent} from './pagination/pagination.component';
import {ModalComponent} from './modal/modal.component';
import {HeaderComponent} from './header/header.component';
import {FilterComponent} from './filter/filter.component';
import {FilterPipe} from './pipes/filter.pipe';
import {OrderPipe} from './pipes/order.pipe';
import {StringFilterComponent} from './filter/string-filter.component';
import {ListFilterComponent} from './filter/list-filter.component';
import {RangeFilterComponent} from './filter/range-filter.component';
import {FormComponent} from './form/form.component';
import {CrudTableComponent} from './crud-table/crud-table.component';
import {BodyComponent} from './body/body.component';
import {BodyRowComponent} from './body/body-row.component';
import {BodyCellComponent} from './body/body-cell.component';
import {BodyCellEditComponent} from './body/body-cell-edit.component';
import {BodyCellActionComponent} from './body/body-cell-action.component';
import {BodyScrollDirective} from './directives/body-scroll.directive';
import {DataTableComponent} from './data-table/data-table.component';
import {ResizeableColumnDirective} from './directives/resizeable-column.directive';
import {TreeTableComponent} from './tree-table/tree-table.component';
import {TreeTableNodeComponent} from './tree-table/tree-table-node.component';
import {ModalEditFormComponent} from './modal-edit-form/modal-edit-form.component';
import {InputComponent} from './form/input.component';
import {InputOptionComponent} from './form/input-option.component';
import {SelectComponent} from './form/select.component';
import {CheckboxComponent} from './form/checkbox.component';
import {RadioComponent} from './form/radio.component';
import {InputTextComponent} from './form/input-text.component';
import {TextareaComponent} from './form/textarea.component';
import {CalendarComponent} from './form/calendar.component';
import {ModalSelectComponent} from './modal-select/modal-select.component';
import {PopupSelectComponent} from './form/select-popup.component';
import {SummaryRowComponent} from './body/summary-row.component';
import {RowViewComponent} from './row-view/row-view.component';
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
