import {Component, ViewEncapsulation, ViewChild, AfterViewInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {NavMenuComponent} from './nav-menu/nav-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css', '../../dist/ng-mazdik-lib/styles/tree-icons.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit {

  navbarExpand: boolean = false;
  state: string;
  navMenuNodes: any[];
  @ViewChild(NavMenuComponent, {static: false}) navMenu: NavMenuComponent;
  link = 'https://github.com/mazdik/ng-mazdik';

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.state = event.url.substr(1);
      }
    });
    this.navMenuNodes = this.getNavMenuNodes();
  }

  ngAfterViewInit() {
    const url = window.location.href.split('#')[1];
    const node = this.navMenu.tree.getNodeById(url || '/');
    if (node) {
      node.ensureVisible();
    }
  }

  getSourceLink() {
    const link: string = this.link + '/blob/master/src/app/demo/';
    return (this.state) ? link + this.state + '.component.ts' : link;
  }

  getNavMenuNodes() {
    return [
      {
        name: 'Data table',
        expanded: true,
        children: [
          { id: '/crud-table-demo', name: 'CRUD table' },
          { id: '/data-table-demo', name: 'Data table' },
          { id: '/tree-table-demo', name: 'Tree table' },
          { id: '/tree-table-custom-demo', name: 'Tree table custom' },
          { id: '/master-detail-demo', name: 'Master detail' },
          { id: '/modal-data-table-demo', name: 'Modal data table' },
          { id: '/nested-modals-demo', name: 'Nested modals' },
          { id: '/multiple-sort-demo', name: 'Multiple sorting' },
          { id: '/row-group-demo', name: 'Row group' },
          { id: '/row-group-multiple-demo', name: 'Row group multiple' },
          { id: '/global-filter-demo', name: 'Global filtering' },
          { id: '/row-group-summary-demo', name: 'Summary rows with grouping' },
          { id: '/summary-row-demo', name: 'Summary row' },
          { id: '/multiple-selection-demo', name: 'Multiple selection' },
          { id: '/live-demo', name: 'Live updates' },
          { id: '/virtual-scroll-demo', name: 'Virtual scroll' },
          { id: '/css-demo', name: 'CSS' },
          { id: '/header-demo', name: 'Column groups template' },
          { id: '/template-demo', name: 'Templates' },
          { id: '/events-demo', name: 'Events' },
          { id: '/vertical-group-demo', name: 'Vertical group' },
          { id: '/editable-condition-demo', name: 'Editable condition' },
          { id: '/pipe-demo', name: 'Pipe on column' },
          { id: '/multi-select-demo', name: 'Multi-select' },
          { id: '/custom-row-action-demo', name: 'Custom row action' },
          { id: '/frozen-table-demo', name: 'Frozen table' },
        ]
      },
      {
        name: 'Other',
        children: [
          { id: '/context-menu-demo', name: 'Context menu' },
          { id: '/dropdown-select-demo', name: 'Dropdown select' },
          { id: '/inline-edit-demo', name: 'Inline edit' },
          { id: '/notify-demo', name: 'Notify' },
          { id: '/dynamic-form-demo', name: 'Dynamic forms' },
          { id: '/modal-edit-form-demo', name: 'Modal edit form' },
          { id: '/modal-select-demo', name: 'Modal select' },
          { id: '/pagination-demo', name: 'Pagination' },
          { id: '/scroller-demo', name: 'Virtual scroller' },
          { id: '/select-list-demo', name: 'Select list' },
          { id: '/tree-view-demo', name: 'Tree view' },
          { id: '/dual-list-box-demo', name: 'Dual list box' },
          { id: '/dropdown-directive-demo', name: 'Dropdown directive' },
          { id: '/draggable-directive-demo', name: 'Draggable directive' },
          { id: '/drag-drop-demo', name: 'Drag and drop' },
          { id: '/resizable-directive-demo', name: 'Resizable directive' },
        ]
      },
      {
        name: 'Modal',
        children: [
          { id: '/modal-demo', name: 'Basic modal' },
          { id: '/nested-modal-demo', name: 'Nested modals' },
          { id: '/panel-demo', name: 'Panels' },
        ]
      },
    ];

  }

}
