import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules, Routes } from '@angular/router';

import {
  CrudTableModule, DataTableModule, TreeTableModule, DtToolbarModule, ModalModule, ModalEditFormModule, ScrollerModule,
  TreeViewModule, ContextMenuModule, NotifyModule, DropdownSelectModule, SelectListModule, DragDropModule, DropdownModule,
  DualListBoxModule, DraggableModule, ResizableModule, PaginationModule, ModalSelectModule, InlineEditModule, DynamicFormModule,
  TabsModule, NavMenuModule
} from 'ng-mazdik-lib';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './not-found.component';
import { CrudTableDemoComponent } from './demo/crud-table-demo.component';
import { TreeTableDemoComponent } from './demo/tree-table-demo.component';
import { DataTableDemoComponent } from './demo/data-table-demo.component';
import { MasterDetailDemoComponent } from './demo/master-detail-demo.component';
import { ModalEditFormDemoComponent } from './demo/modal-edit-form-demo.component';
import { ModalDataTableDemoComponent } from './demo/modal-data-table-demo.component';
import { MultipleSortDemoComponent } from './demo/multiple-sort-demo.component';
import { RowGroupDemoComponent } from './demo/row-group-demo.component';
import { RowGroupMultipleDemoComponent } from './demo/row-group-multiple-demo.component';
import { GlobalFilterDemoComponent } from './demo/global-filter-demo.component';
import { RowGroupSummaryDemoComponent } from './demo/row-group-summary-demo.component';
import { SummaryRowDemoComponent } from './demo/summary-row-demo.component';
import { MultipleSelectionDemoComponent } from './demo/multiple-selection-demo.component';
import { LiveDemoComponent } from './demo/live-demo.component';
import { VirtualScrollDemoComponent } from './demo/virtual-scroll-demo.component';
import { CssDemoComponent } from './demo/css-demo.component';
import { ColumnGroupDemoComponent } from './demo/column-group-demo.component';
import { TemplateDemoComponent } from './demo/template-demo.component';
import { EventsDemoComponent } from './demo/events-demo.component';
import { VerticalGroupDemoComponent } from './demo/vertical-group-demo.component';
import { TreeViewDemoComponent } from './demo/tree-view-demo.component';
import { EditableConditionDemoComponent } from './demo/editable-condition-demo.component';
import { TreeTableCustomDemoComponent } from './demo/tree-table-custom-demo.component';
import { PipeDemoComponent } from './demo/pipe-demo.component';
import { MultiSelectDemoComponent } from './demo/multi-select-demo.component';
import { CustomRowActionDemoComponent } from './demo/custom-row-action-demo.component';
import { DragDropDemoComponent } from './demo/drag-drop-demo.component';
import { ScrollerDemoComponent } from './demo/scroller-demo.component';
import { DropdownDirectiveDemoComponent } from './demo/dropdown-directive-demo.component';
import { DualListBoxDemoComponent } from './demo/dual-list-box-demo.component';
import { DraggableDirectiveDemoComponent } from './demo/draggable-directive-demo.component';
import { ResizableDirectiveDemoComponent } from './demo/resizable-directive-demo.component';
import { SelectListDemoComponent } from './demo/select-list-demo.component';
import { PaginationDemoComponent } from './demo/pagination-demo.component';
import { ModalSelectDemoComponent } from './demo/modal-select-demo.component';
import { NotifyDemoComponent } from './demo/notify-demo.component';
import { InlineEditDemoComponent } from './demo/inline-edit-demo.component';
import { DropdownSelectDemoComponent } from './demo/dropdown-select-demo.component';
import { ContextMenuDemoComponent } from './demo/context-menu-demo.component';
import { ModalDemoComponent } from './demo/modal-demo.component';
import { NestedModalDemoComponent } from './demo/nested-modal-demo.component';
import { PanelDemoComponent } from './demo/panel-demo.component';
import { DynamicFormDemoComponent } from './demo/dynamic-form-demo.component';
import { TabsDemoComponent } from './demo/tabs-demo.component';
import { NavMenuDemoComponent } from './demo/nav-menu-demo.component';

const ROUTES: Routes = [
  { path: '', component: CrudTableDemoComponent },
  { path: 'crud-table-demo', component: CrudTableDemoComponent },
  { path: 'tree-table-demo', component: TreeTableDemoComponent },
  { path: 'data-table-demo', component: DataTableDemoComponent },
  { path: 'master-detail-demo', component: MasterDetailDemoComponent },
  { path: 'modal-edit-form-demo', component: ModalEditFormDemoComponent },
  { path: 'modal-data-table-demo', component: ModalDataTableDemoComponent },
  { path: 'multiple-sort-demo', component: MultipleSortDemoComponent },
  { path: 'row-group-demo', component: RowGroupDemoComponent },
  { path: 'row-group-multiple-demo', component: RowGroupMultipleDemoComponent },
  { path: 'global-filter-demo', component: GlobalFilterDemoComponent },
  { path: 'row-group-summary-demo', component: RowGroupSummaryDemoComponent },
  { path: 'summary-row-demo', component: SummaryRowDemoComponent },
  { path: 'multiple-selection-demo', component: MultipleSelectionDemoComponent },
  { path: 'live-demo', component: LiveDemoComponent },
  { path: 'virtual-scroll-demo', component: VirtualScrollDemoComponent },
  { path: 'css-demo', component: CssDemoComponent },
  { path: 'column-group-demo', component: ColumnGroupDemoComponent },
  { path: 'template-demo', component: TemplateDemoComponent },
  { path: 'events-demo', component: EventsDemoComponent },
  { path: 'vertical-group-demo', component: VerticalGroupDemoComponent },
  { path: 'tree-view-demo', component: TreeViewDemoComponent },
  { path: 'editable-condition-demo', component: EditableConditionDemoComponent },
  { path: 'tree-table-custom-demo', component: TreeTableCustomDemoComponent },
  { path: 'pipe-demo', component: PipeDemoComponent },
  { path: 'multi-select-demo', component: MultiSelectDemoComponent },
  { path: 'custom-row-action-demo', component: CustomRowActionDemoComponent },
  { path: 'drag-drop-demo', component: DragDropDemoComponent },
  { path: 'scroller-demo', component: ScrollerDemoComponent },
  { path: 'dropdown-directive-demo', component: DropdownDirectiveDemoComponent },
  { path: 'dual-list-box-demo', component: DualListBoxDemoComponent },
  { path: 'draggable-directive-demo', component: DraggableDirectiveDemoComponent },
  { path: 'resizable-directive-demo', component: ResizableDirectiveDemoComponent },
  { path: 'select-list-demo', component: SelectListDemoComponent },
  { path: 'pagination-demo', component: PaginationDemoComponent },
  { path: 'modal-select-demo', component: ModalSelectDemoComponent },
  { path: 'notify-demo', component: NotifyDemoComponent },
  { path: 'inline-edit-demo', component: InlineEditDemoComponent },
  { path: 'dropdown-select-demo', component: DropdownSelectDemoComponent },
  { path: 'context-menu-demo', component: ContextMenuDemoComponent },
  { path: 'modal-demo', component: ModalDemoComponent },
  { path: 'nested-modal-demo', component: NestedModalDemoComponent },
  { path: 'panel-demo', component: PanelDemoComponent },
  { path: 'dynamic-form-demo', component: DynamicFormDemoComponent },
  { path: 'tabs-demo', component: TabsDemoComponent },
  { path: 'nav-menu-demo', component: NavMenuDemoComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    CrudTableDemoComponent,
    TreeTableDemoComponent,
    DataTableDemoComponent,
    MasterDetailDemoComponent,
    ModalEditFormDemoComponent,
    ModalDataTableDemoComponent,
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
    ColumnGroupDemoComponent,
    TemplateDemoComponent,
    EventsDemoComponent,
    VerticalGroupDemoComponent,
    TreeViewDemoComponent,
    EditableConditionDemoComponent,
    TreeTableCustomDemoComponent,
    PipeDemoComponent,
    DateFormatPipe,
    MultiSelectDemoComponent,
    CustomRowActionDemoComponent,
    DragDropDemoComponent,
    ScrollerDemoComponent,
    DropdownDirectiveDemoComponent,
    DualListBoxDemoComponent,
    DraggableDirectiveDemoComponent,
    ResizableDirectiveDemoComponent,
    SelectListDemoComponent,
    PaginationDemoComponent,
    ModalSelectDemoComponent,
    NotifyDemoComponent,
    InlineEditDemoComponent,
    DropdownSelectDemoComponent,
    ContextMenuDemoComponent,
    ModalDemoComponent,
    NestedModalDemoComponent,
    PanelDemoComponent,
    DynamicFormDemoComponent,
    TabsDemoComponent,
    NavMenuDemoComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    NavMenuModule,
    CrudTableModule,
    DataTableModule,
    TreeTableModule,
    DtToolbarModule,
    ModalModule,
    ModalEditFormModule,
    ScrollerModule,
    TreeViewModule,
    ContextMenuModule,
    NotifyModule,
    DropdownSelectModule,
    SelectListModule,
    DragDropModule,
    DropdownModule,
    DualListBoxModule,
    DraggableModule,
    ResizableModule,
    PaginationModule,
    ModalSelectModule,
    InlineEditModule,
    DynamicFormModule,
    TabsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
