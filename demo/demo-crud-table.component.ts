import {Component} from '@angular/core';

@Component({
  selector: 'demo-crud-table',
  template: `
    <h2 style="color: #5b9bd5">Demo crud data table</h2>
    <div class="row">
      <div class="col-md-2">
        <ul class="demo-list">
          <li><span (click)="state='table-base'" [ngClass]="{'active': state === 'table-base'}">Basic demo</span></li>
          <li><span (click)="state='tree-table-demo'" [ngClass]="{'active': state === 'tree-table-demo'}">Tree table demo</span></li>
          <li><span (click)="state='tree-filter-demo'" [ngClass]="{'active': state === 'tree-filter-demo'}">Tree filter demo</span></li>
          <li><span (click)="state='data-table-demo'" [ngClass]="{'active': state === 'data-table-demo'}">Data-table demo</span></li>
        </ul>
      </div>
      <div class="col-md-10">
        <basic-demo *ngIf="state === 'table-base'"></basic-demo>
        <tree-table-demo *ngIf="state === 'tree-table-demo'"></tree-table-demo>
        <tree-filter-demo *ngIf="state === 'tree-filter-demo'"></tree-filter-demo>
        <data-table-demo *ngIf="state === 'data-table-demo'"></data-table-demo>
      </div>
    </div>
  `,
  styles: [
    '.demo-list {list-style: none; padding: 0; margin: 0;}',
    '.demo-list span {cursor:pointer; color:#5b9bd5; display: block; padding: 8px 0px;}',
    '.demo-list span:hover {background-color: #5b9bd5; color: white;}',
    '.demo-list span.active {background-color: #5b9bd5; color: white;}',
  ]
})
export class DemoCrudTableComponent {

  public state: string = 'table-base';

}
