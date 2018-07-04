import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {PaginationComponent} from './components/pagination/pagination.component';
import {HeaderComponent} from './components/header/header.component';
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
import {BodyScrollDirective} from './directives/body-scroll.directive';
import {DataTableComponent} from './components/data-table/data-table.component';
import {ResizeableColumnDirective} from './directives/resizeable-column.directive';
import {TreeTableComponent} from './components/tree-table/tree-table.component';
import {TreeTableNodeComponent} from './components/tree-table/tree-table-node.component';
import {SummaryRowComponent} from './components/body/summary-row.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
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
    BodyScrollDirective,
    ResizeableColumnDirective,
    DataTableComponent,
    TreeTableComponent,
    TreeTableNodeComponent,
    SummaryRowComponent,
    ToolbarComponent,
    BodyMouseoverDirective,
    BodyKeydownDirective,
    BodyClickDirective,
    BodyDblClickDirective,
    AfterViewFocusDirective,
    BodyContextMenuDirective,
  ],
  exports: [
    DataTableComponent,
    TreeTableComponent,
    ToolbarComponent,
    PaginationComponent,
  ],
  providers: []
})
export class DataTableModule {
}
