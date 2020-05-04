import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-menu-demo',
  template: `
    <app-nav-menu class="nav-menu-demo1" [nodes]="navMenuNodes" [minimize]="false"></app-nav-menu>
    <p>Minimize: true</p>
    <app-nav-menu class="nav-menu-demo2" [nodes]="navMenuNodes" [minimize]="true"></app-nav-menu>
  `,
})
export class NavMenuDemoComponent implements OnInit {

  navMenuNodes: any[] = [
    {
      name: 'First menu',
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
      name: 'Second menu',
      children: [
        { id: '/crud-table-demo', name: 'Menu 2 link 1' },
        { id: '/data-table-demo', name: 'Menu 2 link 2' },
        { id: '/tree-table-demo', name: 'Menu 2 link 3' },
      ]
    },
    {
      name: 'With icons',
      icon: 'dt-icon-reload',
      children: [
        { id: '/crud-table-demo', name: 'Menu 2 link 1', icon: 'dt-icon-shrink' },
        { id: '/data-table-demo', name: 'Menu 2 link 2', icon: 'dt-icon-reload' },
        { id: '/tree-table-demo', name: 'Menu 2 link 3', icon: 'dt-icon-shrink' },
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
