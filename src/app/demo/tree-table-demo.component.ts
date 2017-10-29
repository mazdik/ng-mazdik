import {Component} from '@angular/core';
import {ITreeNode, Column} from '../../ng-crud-table';

@Component({
  selector: 'tree-table-demo',
  template: '<tree-table [nodes]="treeNodes" [columns]="columns"></tree-table>'
})
export class TreeTableDemoComponent {

  constructor() {
  }

  public columns: Column[] = [
    {
      title: 'Column',
      name: 'column',
      sortable: false,
      filter: false,
      frozen: false,
      resizeable: true,
      editable: true,
      width: 250,
    },
    {
      title: 'Cube_size',
      name: 'cube_size',
      sortable: false,
      filter: false,
      frozen: false,
      resizeable: true,
      editable: true,
      width: 250,
    },
  ];

  public treeNodes: ITreeNode[] = [
    {
      id: 'ASMODIANS',
      name: 'ASMODIANS',
      data: {column: 'race', cube_size: '1'},
      children: [
        {
          id: 'MALE',
          name: 'MALE',
          data: {column: 'gender', cube_size: '12'},
        },
        {
          id: 'FEMALE',
          name: 'FEMALE',
          data: {column: 'gender', cube_size: '13'},
        }],
    },
    {
      id: 'ELYOS',
      name: 'ELYOS',
      data: {column: 'race', cube_size: '2'},
      children: [
        {
          id: 'MALE',
          name: 'MALE',
          data: {column: 'gender', cube_size: '21'},
          children: [
            {
              id: 'ASD',
              name: 'ASD',
              data: {column: 'gender', cube_size: '21'},
            }
          ],
        },
        {
          id: 'FEMALE',
          name: 'FEMALE',
          data: {column: 'gender', cube_size: '22'},
        }],
    }
  ];

}
