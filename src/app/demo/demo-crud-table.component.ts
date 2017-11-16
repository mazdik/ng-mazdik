import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-crud-table',
  template: `
    <h2 style="color: #5b9bd5">Demo crud data table</h2>
    <div class="dt-row">
      <div class="dt-col-left">
        <ul class="demo-list">
          <li><span (click)="state='table-base'" [ngClass]="{'active': state === 'table-base'}">Basic demo</span></li>
          <li><span (click)="state='tree-table-demo'" [ngClass]="{'active': state === 'tree-table-demo'}">Tree table demo</span>
          </li>
          <li><span (click)="state='tree-filter-demo'" [ngClass]="{'active': state === 'tree-filter-demo'}">Tree filter demo</span>
          </li>
          <li><span (click)="state='data-table-demo'" [ngClass]="{'active': state === 'data-table-demo'}">Data table demo</span>
          </li>
          <li><span (click)="state='master-detail-demo'" [ngClass]="{'active': state === 'master-detail-demo'}">Master detail demo</span>
          </li>
          <li><span (click)="state='modal-form-demo'" [ngClass]="{'active': state === 'modal-form-demo'}">Modal form demo</span>
          </li>
          <li><span (click)="state='modal-data-table-demo'" [ngClass]="{'active': state === 'modal-data-table-demo'}">
            Modal data table demo</span>
          </li>
        </ul>
      </div>
      <div class="dt-col-right">
        <basic-demo *ngIf="state === 'table-base'"></basic-demo>
        <tree-table-demo *ngIf="state === 'tree-table-demo'"></tree-table-demo>
        <tree-filter-demo *ngIf="state === 'tree-filter-demo'"></tree-filter-demo>
        <data-table-demo *ngIf="state === 'data-table-demo'"></data-table-demo>
        <master-detail-demo *ngIf="state === 'master-detail-demo'"></master-detail-demo>
        <modal-form-demo *ngIf="state === 'modal-form-demo'"></modal-form-demo>
        <modal-data-table-demo *ngIf="state === 'modal-data-table-demo'"></modal-data-table-demo>
      </div>
    </div>
  `,
  styleUrls: ['./demo-crud-table.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DemoCrudTableComponent {

  public state: string = 'table-base';

}
