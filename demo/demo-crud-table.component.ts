import {Component} from '@angular/core';

@Component({
  selector: 'demo-crud-table',
  template: `
    <h2 style="color: #5b9bd5">Demo crud data table</h2>
    <div class="row">
      <div class="col-md-2">
        <ul class="demo-list">
          <li><span (click)="state=''">Basic demo</span></li>
          <li><span (click)="state='tree-table-demo'">Tree table demo</span></li>
          <li><span (click)="state='tree-filter-demo'">Tree filter demo</span></li>
        </ul>
      </div>
      <div class="col-md-10">
        <basic-demo *ngIf="!state"></basic-demo>
        <tree-table-demo *ngIf="state === 'tree-table-demo'"></tree-table-demo>
        <tree-filter-demo *ngIf="state === 'tree-filter-demo'"></tree-filter-demo>
      </div>
    </div>
  `,
  styles: [
    '.demo-list {list-style: none; padding: 0; margin: 0;}',
    '.demo-list span {cursor:pointer; color:#5b9bd5; display: block; padding: 8px 0px;}',
    '.demo-list span:hover {background-color: #5b9bd5; color: white;}'
  ]
})
export class DemoCrudTableComponent {

  public state: string;

}
