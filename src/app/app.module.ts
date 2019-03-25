import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PageNotFoundComponent} from './not-found.component';
import { CrudTableModule } from '../lib/ng-crud-table';
import { DataTableModule } from '../lib/ng-data-table';
import { TreeTableModule } from '../lib/ng-tree-table';
import { DtToolbarModule } from '../lib/dt-toolbar';
import { ModalModule } from '../lib//modal';
import { ModalEditFormModule } from '../lib/modal-edit-form';
import { TreeViewModule } from '../lib/tree-view';
import { ContextMenuModule } from '../lib/context-menu';
import { NotifyModule } from '../lib/notify';
import { DateFormatPipe } from './pipes/date-format.pipe';

import { BasicDemoComponent } from './demo/basic-demo.component';
import { TreeTableDemoComponent } from './demo/tree-table-demo.component';
import { DataTableDemoComponent } from './demo/data-table-demo.component';
import { MasterDetailDemoComponent } from './demo/master-detail-demo.component';
import { ModalFormDemoComponent } from './demo/modal-form-demo.component';
import { ModalDataTableDemoComponent } from './demo/modal-data-table-demo.component';
import { NestedModalsDemoComponent} from './demo/nested-modals-demo.component';
import { MultipleSortDemoComponent } from './demo/multiple-sort-demo.component';
import { RowGroupDemoComponent } from './demo/row-group-demo.component';
import { RowGroupMultipleDemoComponent } from './demo/row-group-multiple-demo.component';
import { GlobalFilterDemoComponent } from './demo/global-filter-demo.component';
import { RowGroupSummaryDemoComponent } from './demo/row-group-summary-demo.component';
import { SummaryRowDemoComponent } from './demo/summary-row-demo.component';
import { MultipleSelectionDemoComponent } from './demo/multiple-selection-demo.component';
import { LiveDemoComponent} from './demo/live-demo.component';
import { VirtualScrollDemoComponent } from './demo/virtual-scroll-demo.component';
import { CssDemoComponent } from './demo/css-demo.component';
import { HeaderDemoComponent } from './demo/header-demo.component';
import { TemplateDemoComponent } from './demo/template-demo.component';
import { EventsDemoComponent } from './demo/events-demo.component';
import { VerticalGroupDemoComponent } from './demo/vertical-group-demo.component';
import { TreeViewDemoComponent } from './demo/tree-view-demo.component';
import { EditableConditionDemoComponent } from './demo/editable-condition-demo.component';
import { TreeTableCustomDemoComponent } from './demo/tree-table-custom-demo.component';
import { PipeDemoComponent } from './demo/pipe-demo.component';
import { ColumnResizeModeDemoComponent } from './demo/column-resize-mode-demo.component';

const ROUTES: Routes = [
  {path: '', component: BasicDemoComponent},
  {path: 'basic-demo', component: BasicDemoComponent},
  {path: 'tree-table-demo', component: TreeTableDemoComponent},
  {path: 'data-table-demo', component: DataTableDemoComponent},
  {path: 'master-detail-demo', component: MasterDetailDemoComponent},
  {path: 'modal-form-demo', component: ModalFormDemoComponent},
  {path: 'modal-data-table-demo', component: ModalDataTableDemoComponent},
  {path: 'nested-modals-demo', component: NestedModalsDemoComponent},
  {path: 'multiple-sort-demo', component: MultipleSortDemoComponent},
  {path: 'row-group-demo', component: RowGroupDemoComponent},
  {path: 'row-group-multiple-demo', component: RowGroupMultipleDemoComponent},
  {path: 'global-filter-demo', component: GlobalFilterDemoComponent},
  {path: 'row-group-summary-demo', component: RowGroupSummaryDemoComponent},
  {path: 'summary-row-demo', component: SummaryRowDemoComponent},
  {path: 'multiple-selection-demo', component: MultipleSelectionDemoComponent},
  {path: 'live-demo', component: LiveDemoComponent},
  {path: 'virtual-scroll-demo', component: VirtualScrollDemoComponent},
  {path: 'css-demo', component: CssDemoComponent},
  {path: 'header-demo', component: HeaderDemoComponent},
  {path: 'template-demo', component: TemplateDemoComponent},
  {path: 'events-demo', component: EventsDemoComponent},
  {path: 'vertical-group-demo', component: VerticalGroupDemoComponent},
  {path: 'tree-view-demo', component: TreeViewDemoComponent},
  {path: 'editable-condition-demo', component: EditableConditionDemoComponent},
  {path: 'tree-table-custom-demo', component: TreeTableCustomDemoComponent},
  {path: 'pipe-demo', component: PipeDemoComponent},
  {path: 'column-resize-mode-demo', component: ColumnResizeModeDemoComponent},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    BasicDemoComponent,
    TreeTableDemoComponent,
    DataTableDemoComponent,
    MasterDetailDemoComponent,
    ModalFormDemoComponent,
    ModalDataTableDemoComponent,
    NestedModalsDemoComponent,
    MultipleSortDemoComponent,
    RowGroupDemoComponent,
    RowGroupMultipleDemoComponent,
    GlobalFilterDemoComponent,
    RowGroupSummaryDemoComponent,
    SummaryRowDemoComponent,
    MultipleSelectionDemoComponent,
    LiveDemoComponent,
    VirtualScrollDemoComponent,
    CssDemoComponent,
    HeaderDemoComponent,
    TemplateDemoComponent,
    EventsDemoComponent,
    VerticalGroupDemoComponent,
    TreeViewDemoComponent,
    EditableConditionDemoComponent,
    TreeTableCustomDemoComponent,
    PipeDemoComponent,
    ColumnResizeModeDemoComponent,
    DateFormatPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    CrudTableModule,
    DataTableModule,
    TreeTableModule,
    DtToolbarModule,
    ModalModule,
    ModalEditFormModule,
    TreeViewModule,
    ContextMenuModule,
    NotifyModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
