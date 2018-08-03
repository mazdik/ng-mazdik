import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {PaginationComponent} from './components/pagination/pagination.component';
import {HeaderComponent} from './components/header/header.component';
import {HeaderCellComponent} from './components/header/header-cell.component';
import {HeaderCellActionComponent} from './components/header/header-cell-action.component';
import {FilterComponent} from './components/filter/filter.component';
import {FilterPipe} from './pipes/filter.pipe';
import {StringFilterComponent} from './components/filter/string-filter.component';
import {ListFilterComponent} from './components/filter/list-filter.component';
import {RangeFilterComponent} from './components/filter/range-filter.component';
import {BodyComponent} from './components/body/body.component';
import {BodyRowComponent} from './components/body/body-row.component';
import {BodyCellComponent} from './components/body/body-cell.component';
import {BodyCellEditComponent} from './components/body/body-cell-edit.component';
import {BodyCellActionComponent} from './components/body/body-cell-action.component';
import {DataTableComponent} from './components/data-table/data-table.component';
import {SummaryRowComponent} from './components/body/summary-row.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';

import {BodyScrollDirective} from './directives/body-scroll.directive';
import {ResizeableColumnDirective} from './directives/resizeable-column.directive';
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
  ],
  declarations: [
    PaginationComponent,
    HeaderComponent,
    HeaderCellComponent,
    HeaderCellActionComponent,
    FilterComponent,
    FilterPipe,
    StringFilterComponent,
    ListFilterComponent,
    RangeFilterComponent,
    BodyComponent,
    BodyRowComponent,
    BodyCellComponent,
    BodyCellEditComponent,
    BodyCellActionComponent,
    DataTableComponent,
    SummaryRowComponent,
    ToolbarComponent,
    BodyScrollDirective,
    ResizeableColumnDirective,
    BodyMouseoverDirective,
    BodyKeydownDirective,
    BodyClickDirective,
    BodyDblClickDirective,
    AfterViewFocusDirective,
    BodyContextMenuDirective,
  ],
  exports: [
    DataTableComponent,
    ToolbarComponent,
    PaginationComponent,
    HeaderComponent,
    BodyScrollDirective,
    BodyKeydownDirective,
    BodyClickDirective,
    BodyDblClickDirective,
    BodyCellComponent,
    BodyCellEditComponent,
  ],
  providers: []
})
export class DataTableModule {
}
