import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {PaginationModule} from '../lib/pagination';
import {ScrollerModule} from '../lib/scroller';
import {SelectListModule} from '../lib/select-list';
import {InlineEditModule} from '../lib/inline-edit';
import {SortHeaderModule} from '../lib/sort-header';
import {ResizableModule} from '../lib/resizable';
import {DtTranslateModule} from '../lib/dt-translate';
import {HeaderComponent} from './components/header/header.component';
import {HeaderCellComponent} from './components/header/header-cell.component';
import {HeaderCellActionComponent} from './components/header/header-cell-action.component';
import {FilterComponent} from './components/filter/filter.component';
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
import {BodyGroupRowComponent} from './components/body/body-group-row.component';

import {BodyMouseoverDirective} from './directives/body-mouseover.directive';
import {BodyKeydownDirective} from './directives/body-keydown.directive';
import {BodyClickDirective} from './directives/body-click.directive';
import {BodyDblClickDirective} from './directives/body-dblclick.directive';
import {BodyContextMenuDirective} from './directives/body-contextmenu.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule,
    ScrollerModule,
    SelectListModule,
    InlineEditModule,
    SortHeaderModule,
    ResizableModule,
    DtTranslateModule.forChild(),
  ],
  declarations: [
    HeaderComponent,
    HeaderCellComponent,
    HeaderCellActionComponent,
    FilterComponent,
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
    BodyGroupRowComponent,
    BodyMouseoverDirective,
    BodyKeydownDirective,
    BodyClickDirective,
    BodyDblClickDirective,
    BodyContextMenuDirective,
  ],
  exports: [
    DataTableComponent,
  ],
  providers: []
})
export class DataTableModule {}
