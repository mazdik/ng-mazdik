import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PaginationModule} from '../pagination/pagination-module';
import {ScrollerModule} from '../scroller/scroller-module';
import {SelectListModule} from '../select-list/select-list-module';
import {InlineEditModule} from '../inline-edit/inline-edit-module';
import {ResizableModule} from '../resizable/resizable-module';
import {HeaderComponent} from './components/header/header.component';
import {HeaderCellComponent} from './components/header/header-cell.component';
import {FilterComponent} from './components/filter/filter.component';
import {StringFilterComponent} from './components/filter/string-filter.component';
import {ListFilterComponent} from './components/filter/list-filter.component';
import {RangeFilterComponent} from './components/filter/range-filter.component';
import {BodyComponent} from './components/body/body.component';
import {BodyRowComponent} from './components/body/body-row.component';
import {BodyCellComponent} from './components/body/body-cell.component';
import {BodyCellEditComponent} from './components/body/body-cell-edit.component';
import {DataTableComponent} from './components/data-table/data-table.component';

import {BodyMouseoverDirective} from './directives/body-mouseover.directive';
import {BodyKeydownDirective} from './directives/body-keydown.directive';
import {BodyClickDirective} from './directives/body-click.directive';
import {BodyDblClickDirective} from './directives/body-dblclick.directive';
import {BodyContextMenuDirective} from './directives/body-contextmenu.directive';
import {HeaderTemplateDirective} from './directives/header-template.directive';
import {RowGroupTemplateDirective} from './directives/row-group-template.directive';

@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    ScrollerModule,
    SelectListModule,
    InlineEditModule,
    ResizableModule,
  ],
  declarations: [
    HeaderComponent,
    HeaderCellComponent,
    FilterComponent,
    StringFilterComponent,
    ListFilterComponent,
    RangeFilterComponent,
    BodyComponent,
    BodyRowComponent,
    BodyCellComponent,
    BodyCellEditComponent,
    DataTableComponent,
    BodyMouseoverDirective,
    BodyKeydownDirective,
    BodyClickDirective,
    BodyDblClickDirective,
    BodyContextMenuDirective,
    HeaderTemplateDirective,
    RowGroupTemplateDirective,
  ],
  exports: [
    DataTableComponent,
    HeaderTemplateDirective,
    RowGroupTemplateDirective,
  ]
})
export class DataTableModule {}
