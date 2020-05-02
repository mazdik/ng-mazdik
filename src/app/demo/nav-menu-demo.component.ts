import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-menu-demo',
  template: `<app-nav-menu class="nav-menu-demo" [nodes]="navMenuNodes" [minimize]="false"></app-nav-menu>`,
})
export class NavMenuDemoComponent implements OnInit {

  navMenuNodes: any[] = [
    {
      name: 'Menu 1',
      expanded: true,
      children: [
        { id: '/crud-table-demo', name: 'Menu 1 link 1' },
        { id: '/data-table-demo', name: 'Menu 1 link 2' },
        {
          name: 'Submenu ',
          expanded: true,
          children: [
            { id: '/nav-menu-demo', name: 'Submenu link 1' },
            { id: '/data-table-demo', name: 'Submenu link 2' },
            { id: '/tree-table-demo', name: 'Submenu link 3' },
          ]
        },
      ]
    },
    {
      name: 'Menu 2',
      children: [
        { id: '/crud-table-demo', name: 'Menu 2 link 1' },
        { id: '/data-table-demo', name: 'Menu 2 link 2' },
        { id: '/tree-table-demo', name: 'Menu 2 link 3' },
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
