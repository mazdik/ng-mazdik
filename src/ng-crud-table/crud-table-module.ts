import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {PaginationComponent} from './pagination/pagination.component';
import {ModalComponent} from './modal/modal.component';
import {HeaderComponent} from './header/header.component';
import {FilterComponent} from './filter/filter.component';
import {SearchFilterPipe} from './filter/search-filter.pipe';
import {StringFilterComponent} from './filter/string-filter.component';
import {ListFilterComponent} from './filter/list-filter.component';
import {RangeFilterComponent} from './filter/range-filter.component';
import {FormComponent} from './form/form.component';
import {CrudTableComponent} from './crud-table.component';
import {BodyComponent} from './body/body.component';
import {BodyRowComponent} from './body/body-row.component';
import {BodyCellComponent} from './body/body-cell.component';
import {BodyCellEditComponent} from './body/body-cell-edit.component';
import {ScrollerComponent} from './body/scroller.component';
import {DatatableComponent} from './datatable/datatable.component';
import {ResizeableDirective} from './directives/resizeable.directive';
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
    SearchFilterPipe,
    StringFilterComponent,
    ListFilterComponent,
    RangeFilterComponent,
    FormComponent,
    BodyComponent,
    BodyRowComponent,
    BodyCellComponent,
    BodyCellEditComponent,
    ResizeableDirective,
    ScrollerComponent,
    DatatableComponent,
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
  ],
  exports: [
    DatatableComponent,
    CrudTableComponent,
    TreeTableComponent,
    ModalComponent,
    ModalEditFormComponent,
  ],
  providers: []
})
export class CrudTableModule {
}
