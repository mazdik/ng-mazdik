import {Component, OnInit} from '@angular/core';
import {ITreeNode, ITreeService, Column} from '../../ng-crud-table';
import {HttpClient} from '@angular/common/http';
import {TreeDemoService} from './tree-demo.service';

@Component({
  selector: 'tree-table-demo',
  template: `
    <tree-table
      [service]="treeService"
      [columns]="columns"
      (editComplete)="onEditComplete($event)">
    </tree-table>`
})
export class TreeTableDemoComponent implements OnInit {

  public treeService: ITreeService;

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

  constructor(private http: HttpClient) {
    this.treeService = new TreeDemoService(this.http);
  }

  ngOnInit() {
  }

  onEditComplete(event) {
    console.log(event);
  }

}
